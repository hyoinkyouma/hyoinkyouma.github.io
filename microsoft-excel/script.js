import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://opxrghgktaqfmqmlchzb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_OeMYJl58FCFXNvr9SifPAQ_2CPCEyG_';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Track current application state
let isSignUpView = false;
let currentUser = null;
const gameId = "pokemon_emerald_gba";

// DOM Elements
const authOverlay = document.getElementById('auth-overlay');
const authForm = document.getElementById('auth-form');
const formTitle = document.getElementById('form-title');
const formSubtitle = document.getElementById('form-subtitle');
const usernameGroup = document.getElementById('username-group');
const submitBtn = document.getElementById('submit-btn');
const switchViewBtn = document.getElementById('switch-view-btn');
const switchText = document.getElementById('switch-text');
const messageContainer = document.getElementById('message-container');

// Show status messages helper
function showMsg(text, type = 'error') {
    messageContainer.textContent = text;
    messageContainer.className = `msg-box ${type}`;
}

// Toggle UI View (Login vs Signup Layout)
switchViewBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isSignUpView = !isSignUpView;
    messageContainer.className = 'msg-box';

    if (isSignUpView) {
        formTitle.textContent = "Create Profile";
        formSubtitle.textContent = "Start cloud syncing your game files.";
        usernameGroup.classList.remove('hidden');
        submitBtn.textContent = "Register Account";
        switchText.textContent = "Already have a profile?";
        switchViewBtn.textContent = "Sign In";
    } else {
        formTitle.textContent = "Welcome Back";
        formSubtitle.textContent = "Sign in to sync your emulator saves.";
        usernameGroup.classList.add('hidden');
        submitBtn.textContent = "Sign In";
        switchText.textContent = "Don't have a profile?";
        switchViewBtn.textContent = "Create account";
    }
});

// Auth Submission Handler
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const emailInput = document.getElementById('auth-email');
    const passwordInput = document.getElementById('auth-password');
    const usernameInput = document.getElementById('reg-username');
    
    const email = emailInput.value;
    const password = passwordInput.value;
    const username = usernameInput.value;

    messageContainer.className = 'msg-box';
    emailInput.disabled = true;
    passwordInput.disabled = true;
    usernameInput.disabled = true;
    submitBtn.disabled = true;
    
    const originalBtnText = submitBtn.textContent; 
    submitBtn.innerHTML = '<div class="spinner"></div>';

    try {
        if (isSignUpView) {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { username: username || undefined } }
            });
            if (error) throw error;
            showMsg("Account created! Check email for verification link.", "success");
            submitBtn.textContent = "Check Your Email"; 
        } else {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            currentUser = data.user;
            await onAuthSuccess();
        }
    } catch (error) {
        showMsg(error.message, 'error');
        emailInput.disabled = false;
        passwordInput.disabled = false;
        usernameInput.disabled = false;
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    }
});

// Helper function to load save file from Supabase Storage
async function loadCloudSave(targetId) {
    if (!currentUser) return null;
    const filePath = `${currentUser.id}/${targetId}.sav`;

    try {
        const { data, error } = await supabase.storage
            .from('emulator_saves')
            .download(filePath);

        if (error) {
            console.log("No cloud save found for this profile yet. Starting fresh game loop.");
            return null;
        }
        return URL.createObjectURL(data);
    } catch (err) {
        return null;
    }
}

// Transition to gameplay area
async function onAuthSuccess() {
    authOverlay.classList.add('hidden');
    console.log("Authenticated context ready for user ID:", currentUser.id);

    // 1. Establish your global config values first
    window.EJS_player = "#game";
    window.EJS_core = "mgba"; 
    window.EJS_gameName = "pokemon_emerald";
    window.EJS_gameID = gameId; 
    window.EJS_color = "#0064ff";
    window.EJS_startOnLoaded = true;
    window.EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
    window.EJS_gameUrl = "./rom/pokemon_emerald.gba";
    window.EJS_onSaveState = window.EJS_onSaveUpdate;
    window.EJS_gamePatchUrl = undefined;

    let lastSaveHash = null;
    window.EJS_onGameStart = async function() {
        console.log("✅ Game started");
        const cloudSaveUrl = await loadCloudSave(gameId);
        if (!cloudSaveUrl) return;
        try {
            const response = await fetch(cloudSaveUrl);
            const buffer = await response.arrayBuffer();
            const saveData = new Uint8Array(buffer);
            
            const savePath = window.EJS_emulator.gameManager.getSaveFilePath();
            window.EJS_emulator.gameManager.FS.writeFile(savePath, saveData);
            window.EJS_emulator.gameManager.loadSaveFiles();
            
            console.log("✅ Cloud save loaded into emulator");
        } catch(e) {
            console.error("Failed to load cloud save:", e);
        }
    
        setInterval(async () => {
        try {
            window.EJS_emulator.gameManager.saveSaveFiles();
            const savePath = window.EJS_emulator.gameManager.getSaveFilePath();
            const saveData = window.EJS_emulator.gameManager.FS.readFile(savePath);
            if (!saveData || saveData.length === 0) return;
            // Skip upload if save hasn't changed
            const hash = saveData.reduce((a, b) => a + b, 0);
            if (hash === lastSaveHash) return;
            lastSaveHash = hash;

            const fileBlob = new Blob([saveData], { type: 'application/octet-stream' });
            const filePath = `${currentUser.id}/${window.EJS_gameID}.sav`;

            const { data, error } = await supabase.storage
                .from('emulator_saves')
                .update(filePath, fileBlob, { upsert: true });

         if (error) {
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('emulator-saves')
                .upload(filePath, fileBlob, {
                    contentType: 'application/octet-stream',
                    upsert: true
                });
            if (uploadError) {
                console.error("❌ Sync failed:", uploadError.message);
            } else {
                console.log("✅ Initial upload:", uploadData.path);
            }
        } else {
            console.log("✅ Updated:", data.path);
        }
        } catch(e) {}
        }, 2000);
    };
    // 3. Mount loader.js (It will automatically boot the emulator itself)
    console.log("Mounting EmulatorJS runtime loader...");
    const loaderScript = document.createElement('script');
    loaderScript.src = EJS_pathtodata + "loader.js";
    document.body.appendChild(loaderScript);
}

// Auto-login session cache check on load
window.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        currentUser = session.user;
        await onAuthSuccess();
    }
});


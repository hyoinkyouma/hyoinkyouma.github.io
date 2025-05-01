const url = "https://romanaugusto.up.railway.app/v1/verify";
let key = null;
if (localStorage.getItem("sessionKey") == null) {
  window.location.href = "/admin-page-website/index.html";
} else {
  key = localStorage.getItem("sessionKey");
}

const validateKey = async (key) => {
  try {
    const payload = {
      key: key,
    };
    const responseData = await fetch(url, {
      method: "post",
      body: JSON.stringify(payload),
    });
    const response = await responseData.json();
    if (response.valid == false) {
      window.location.replace("/admin-page-website/index.html");
      localStorage.clear();
    }
  } catch (e) {
    window.location.href = "/admin-page-website/index.html";
    localStorage.clear();
  }
};

if (key != null) validateKey(key);

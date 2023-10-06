const addUserBtn = document.getElementById("addUserBtn");
const userAddForm = document.getElementById("userAddForm")


addUserBtn?.addEventListener("click", () => {
    window.open("./addUserPage.html","_blank")
})

userAddForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendUserAddRequest(e.target)
})  


const sendUserAddRequest = async (form) => {
    try {
        
        const userDetails = {
            username: form.username.value,
            email: form.email.value,
            password: form.password.value,
        }
        
        const response = await fetch("/api/v1/addUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userDetails),
        });
        const data = await response.json()
        console.log(data)
    } catch (error) {
        console.log(error.message)
    }
}
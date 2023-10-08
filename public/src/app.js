    const addUserBtn = document.getElementById("addUserBtn");
    const userAddForm = document.getElementById("userAddForm");
    const usersSection= document.getElementById("userSection")
    const usernameError = document.getElementById("usernameError");
    const emailError = document.getElementById("emailError");



    const createUserCard = (user) => {
      const card = document.createElement("div");
      const name = document.createElement("h3");
      const email = document.createElement("p");

      name.textContent = user.name;
      email.textContent = user.email;

      card.classList.add("userCard");
      card.setAttribute("key", user.id);

      card.appendChild(name);
      card.appendChild(email);

      return card;
    };

const clearForm = (form) => {
                emailError.textContent = "";
                usernameError.textContent = "";
                form.username.value = "";
                form.email.value = "";
                form.password.value = "";
    }


    //open a websocket connection
    const websocket = new WebSocket(
      "ws://stormy-worm-gabardine.cyclic.app"
    );

        websocket.addEventListener("open", (event) => {
          console.log("WebSocket connection established.");

          // Send a message to the server if needed
          websocket.send("Hello from the client!");
        });

        websocket.addEventListener("message", (event) => {
            const newUser = JSON.parse(event.data);
         
            usersSection.appendChild(createUserCard(newUser.data))
        });



websocket.addEventListener("close", (event) => {
  console.log(
    "WebSocket connection closed. Code:",
    event.code,
    "Reason:",
    event.reason
  );
});

websocket.addEventListener("error", (evt) => {
  console.error("WebSocket error:", evt);
});


    

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
            

            if (!response.ok) {
                throw new Error (data.error)
            }
            else {
                clearForm(userAddForm)
            }

        
        } catch (error) {
            if (error.message === 'SQLITE_CONSTRAINT: UNIQUE constraint failed: users.email') {
                emailError.textContent = 'Email already exists'
                usernameError.textContent = ''
            }
            if (error.message === 'SQLITE_CONSTRAINT: UNIQUE constraint failed: users.name') {
                usernameError.textContent = 'Username already exists'
                emailError.textContent = ''
            }
        }
    }



        const getUsers = async () => {
            try {
                const response = await fetch("/api/v1/getUser", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                });

                const data = await response.json()

                console.log(data)

                data.map((user) => usersSection.appendChild(createUserCard(user)))
            }
            catch (error) {
                console.log(error.message)
            }
        }

    window.addEventListener('load',getUsers)


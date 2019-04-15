const container = $('#users');// browser tag container
let localUsers = JSON.parse(localStorage.getItem('localUsers')) || []

const findUserIndex = function (localUsers,uuid) {
    for (let i = 0; i < localUsers.length; i++) {
        if (localUsers[i].uuid === uuid) {
            return i;
        }
    }
}
const editUser = function (user, card) {
    localUsers = JSON.parse(localStorage.getItem('localUsers'))
    card.children('.name').html(`
    <label for="name">Name:</label>
    <input type="text" name="name" value="${user.name}">`)

    card.children('.email').html(`
    <label for="email">Email:</label>
    <input type="text" name="email" value="${user.email}">`)

    card.children('.btns').html('<button class="saveBtn">save</button>')


    $('.saveBtn').click(function (e) {
        let newName = $('[name=name]').val()
        let newEmail = $('[name=email]').val()
        let index = findUserIndex(localUsers, user.uuid);

        user.name = newName
        user.email = newEmail

        
        localUsers.splice(index, 1, user)
        localStorage.setItem("localUsers", JSON.stringify(localUsers));
        renderUsers(localUsers)
    })

}
const deleteUser = function (uuid) {

    localUsers = JSON.parse(localStorage.getItem('localUsers'))
    let index = findUserIndex(localUsers, uuid);

    $(`[data-id=${uuid}]`).remove()
    localUsers.splice(index, 1)
    localStorage.setItem('localUsers', JSON.stringify(localUsers))
}

const fetchUsers = function (url) {

    let usersList = [];
    return new Promise(function (resolve, reject) {
        $.ajax({
            url,
            method: 'GET',
            success: function (data) {
                for (let i = 0; i < data.results.length; i++) {
                    const { results } = data
                    let uuid = results[i].login.uuid
                    let name = results[i].name.first
                    let email = results[i].email
                    let img = results[i].picture.medium
                    let gender = results[i].gender
                    let age = results[i].registered.age

                    const userObject = {
                        uuid: uuid,
                        name: name,
                        email: email,
                        img: img,
                        gender: gender,
                        age: age
                    }
                    usersList.push(userObject);
                }

                localStorage.setItem("localUsers", JSON.stringify(usersList))
                resolve(usersList)
            },
            error: function (error) {
                reject(error)
            }
        })
    })

}
const renderUsers = function (list) {
    container.empty()
    for (let i = 0; i < list.length; i++) {
        const { name, email, img, gender, age, uuid } = list[i]

        let card = $('<div>', { class: name, 'data-id': uuid })

        let buttonsDiv = $('<div>', { class: 'btns' })

        $('<img>', {
            src: img,
            alt: name
        }).appendTo(card)

        $('<h3>', {
            text: 'Name : ' + name,
            class: "name"
        }).appendTo(card)

        $('<span>', {
            text: 'Gender : ' + gender
        }).appendTo(card)

        $('<span>', {
            text: 'Age : ' + age
        }).appendTo(card)

        $('<span>', {
            text: 'Email : ' + email,
            class: "email"
        }).appendTo(card)


        $('<button>', {
            class: "delete-btn",
            text: "Del",
            click: function () {
                deleteUser(uuid)
            }
        }).appendTo(buttonsDiv)

        $('<button>', {
            class: "edit-btn",
            text: "Edit",
            click: function () {
                editUser(list[i], card)
            }
        }).appendTo(buttonsDiv)

        buttonsDiv.appendTo(card)

        card.appendTo(container)

    }
}
if (localUsers && localUsers.length !== 0) {
    renderUsers(localUsers)
} else {
    fetchUsers('https://randomuser.me/api/?results=10')
        .then(localUsers => {
            renderUsers(localUsers);
        })

}

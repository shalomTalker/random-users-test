const container = $('#users');
let list;

function initUsers(list) {

    container.empty();
    
    list.map(function (user, index) {
        let card = $('<div>', { class: 'user-card', 'data-id': index })

        $('<img>', {
            class: 'image',
            src: user.image
        }).appendTo(card)

        $('<span>', {
            class: 'gender',
            text: `Gender: ${user.gender}`
        }).appendTo(card)

        $('<span>', {
            class: 'name',
            text: `Name: ${user.name}`
        }).appendTo(card)

        $('<span>', {
            class: 'age',
            text: `Age: ${user.age}`
        }).appendTo(card)

        $('<span>', {
            class: 'email',
            text: `Email: ${user.email}`
        }).appendTo(card)

        let buttonsDiv = $('<div>', {
            class: 'btns'
        })

        $('<button>', {
            class: "delete-btn",
            text: "Del",
            click: function () {
                deleteUser(user, card)
            }
        }).appendTo(buttonsDiv)

        $('<button>', {
            class: "edit-btn",
            text: "Edit",
            click: function () {
                editUser(user, card)
            }
        }).appendTo(buttonsDiv)

        buttonsDiv.appendTo(card)
        card.appendTo(container)

    })
}
let storage = JSON.parse(localStorage.getItem("users"));

if (storage && storage.length !== 0) {
    list = JSON.parse(localStorage.getItem("users"))
    initUsers(list)
} else {

    list = []
    $.ajax({
        url: 'https://randomuser.me/api/?results=10',
        dataType: 'json',
        success: function (data) {
            data.results.map(function (user) {
                let uuid = user.login.uuid
                let image = user.picture.large
                let gender = user.gender
                let name = user.name.first
                let age = user.dob.age
                let email = user.email
                let object = { uuid, image, gender, name, age, email }
                list.push(object)
            })
            initUsers(list)
            localStorage.setItem("users", JSON.stringify(list));
        }
    });

}
$('#generateBtn').click(function (e) {
    $.ajax({
        url: 'https://randomuser.me/api/',
        dataType: 'json',
        success: function (data) {
            console.log(data)
            let uuid = data.results[0].login.uuid
            let image = data.results[0].picture.large
            let gender = data.results[0].gender
            let name = data.results[0].name.first
            let age = data.results[0].dob.age
            let email = data.results[0].email

            let object = { uuid, image, gender, name, age, email }
            list.push(object)
            initUsers(list)
            localStorage.setItem("users", JSON.stringify(list));
        }
    });
})



function deleteUser(user, card) {
    list.splice(card['data-id'],1)
    card.remove()
    localStorage.setItem("users", JSON.stringify(list));
}
function editUser(user, card) {
    
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

        user.name = newName
        user.email = newEmail

        initUsers(list)
        localStorage.setItem("users", JSON.stringify(list));
    })

}

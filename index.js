const container = $('#users');
var list;
const initUsers = function(list) {
    list.map(function(user, index) {
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
            click: deleteUser(user, card),
        }).appendTo(buttonsDiv)
        $('<button>', {
            class: "edit-btn",
            text: "Edit",
            click: editUser(user, card),
        }).appendTo(buttonsDiv)
        buttonsDiv.appendTo(card)
        card.appendTo(container)

    })
}

if (JSON.parse(localStorage.getItem("users")).length !== 0) {
    list = JSON.parse(localStorage.getItem("users"))
    initUsers(list)
} else {

    list = []
    $.ajax({
        url: 'https://randomuser.me/api/?results=10',
        dataType: 'json',
        success: function(data) {
            data.results.map(function(user) {

                let image = user.picture.large
                let gender = user.gender
                let name = user.name.first
                let age = user.dob.age
                let email = user.email
                let object = { image, gender, name, age, email }
                list.push(object)
            })
            initUsers(list)
            localStorage.setItem("users", JSON.stringify(list));
        }
    });

}
$('#generateBtn').click(function(e) {
    container.empty();
    $.ajax({
        url: 'https://randomuser.me/api/',
        dataType: 'json',
        success: function(data) {
            let image = data.results[0].picture.large
            let gender = data.results[0].gender
            let name = data.results[0].name.first
            let age = data.results[0].dob.age
            let email = data.results[0].email

            let object = { image, gender, name, age, email }
            list.push(object)
            initUsers(list)
            localStorage.setItem("users", JSON.stringify(list));
        }
    });
})



const deleteUser = function(user, card) {
    list.pop(user.id)
    console.log(list);
    card.remove()
    localStorage.setItem("users", JSON.stringify(list));
}
const editUser = function(user, card) {
    card.children('.name').html(`
    <label for="name">Name:</label>
    <input type="text" name="name" value="${user.name}">`)
    card.children('.email').html(`
    <label for="email">Email:</label>
    <input type="text" name="email" value="${user.email}">`)
    card.children('.btns').html('<button class="saveBtn">save</button>')


    $('.saveBtn').click(function(e) {
        let newName = $('[name=name]').val()
        let newEmail = $('[name=email]').val()

        card.children('.name').html(`<span class="name">Name: ${newName}</span>`)
        card.children('.email').html(`<span class="email">Email: ${newEmail}</span>`)

        card.children('.btns').html(`<button class="delete-btn">Del</button><button class="edit-btn">Edit</button>`)
        user.name = newName
        user.email = newEmail

        list.splice(user.id, 1, user)
        $('.delete-btn').click(deleteUser(user, card))
        $('.edit-btn').click(editUser(user, card))

        localStorage.setItem("users", JSON.stringify(list));
    })

}

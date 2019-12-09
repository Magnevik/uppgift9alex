let theKey = ``;
const baseUrl = `https://www.forverkliga.se/JavaScript/api/crud.php`;
console.log(`Script has started`);

window.addEventListener(`load`, () => {
    console.log(`Window has loaded`);
    
    let keyButton = document.querySelector(`.key-button`);
    let loginButton = document.querySelector(`.login-button`);
    let addBookButton = document.querySelector(`.add-book`);
    let keyBox = document.querySelector(`.key-box`);
    let loginInput = document.querySelector(`.login-input`);
    let inputTitle = document.querySelector(`#title-input`);
    let inputAuthor = document.querySelector(`#author-input`);
    let statusMessage = document.querySelector(`.status-message`);
    let bookGrid = document.querySelector(`.book-grid`);
    
    keyButton.addEventListener(`click`, getKey);
    
    loginButton.addEventListener(`click`, logIn);
    
    addBookButton.addEventListener(`click`, addBook);
    
    async function getKey() {
        const getKeyUrl = baseUrl + `?requestKey`;
        const response = await fetch(getKeyUrl);
        const data = await response.json();
        keyButton.disabled = `disabled`;
        keyBox.innerText = data.key;
        theKey = data.key;
    };
    
    async function logIn() {
        theKey = loginInput.value;
        const urlLogin = baseUrl + `?key=` + theKey + `&op=select`;
        
        let loginCount=1;
        for (let i=0; i<5; i++){
            const response = await fetch (urlLogin);
            const data = await response.json();
            console.log(`login data: `, data)
            if (data.status === `success`){
                let successMessage = document.createElement(`li`);
                successMessage.className = `success`;
                successMessage.innerText = `Attempt # ` + loginCount + ` Login success, welcome in!`;
                statusMessage.appendChild(successMessage);
                updateScroll();
                loginButton.disabled = `disabled`;
                for (i=0; i < data.data.length; i++){
                    let storedAuthor = data.data[i].author;
                    let storedTitle = data.data[i].title;
                    let storedId = data.data[i].id;
                    let storedUpdated = data.data[i].updated;
                    createBook(storedTitle, storedAuthor, storedId, storedUpdated);
                }
                break;
            }
            else{
            let error = data.message;
            let failMessage = document.createElement(`li`);
            failMessage.className = `fail`;
            failMessage.innerText = `Attempt # ` + loginCount + ` Seems like something went wrong: ` + error;
            statusMessage.appendChild(failMessage);
            updateScroll();
            }
            loginCount++;
        }
    };
    async function addBook () {
        const urlAdd = baseUrl + `?key=` + theKey + `&op=insert&title=` + inputTitle.value + `&author=` + inputAuthor.value;
        
        let title = inputTitle.value;
        let author = inputAuthor.value;

        if ( title === `` || author === ``) {
            let failMessage = document.createElement(`li`);
            failMessage.className = `fail`;
            failMessage.innerText = `Titel or author are empty, try again!`;
            statusMessage.appendChild(failMessage);
            updateScroll();
        }else{
        let addBookCount = 1;
        for(let i=0; i<5; i++){
            const response = await fetch(urlAdd);
            const data = await response.json();
            if (data.status === `success`){
                let successMessage = document.createElement(`li`);
                successMessage.className = `success`
                successMessage.innerText = `Attempt # ` + addBookCount + ` Added book succesfully!`;
                statusMessage.appendChild(successMessage);
                updateScroll();
                createBook(inputTitle.value, inputAuthor.value, data.id);
                break;
            }
            else {
                let error = data.message;
                let failMessage = document.createElement(`li`);
                failMessage.className = `fail`;
                failMessage.innerText = `Attempt # ` + addBookCount + ` Seems like something went wrong: ` + error;
                statusMessage.appendChild(failMessage);
                updateScroll();
            }
            addBookCount++;
            }
        }
    };

    function createBook(title, author, id, updated=`This session`){
    let book = document.createElement(`div`);
    book.className = `id: ` + id;
    
    let listTitle = document.createElement(`div`);
    listTitle.innerText = `Title: `;
    
    let listAuthor = document.createElement(`div`);
    listAuthor.innerText = `Author: `;
    
    let listUpdated = document.createElement(`div`);
    listUpdated.innerText = 'Updated: ' + updated;
    
    let spanTitle = document.createElement(`span`);
    spanTitle.innerText = title;
    listTitle.appendChild(spanTitle);
    
    let spanAuthor = document.createElement(`span`);
    spanAuthor.innerText = author;
    listAuthor.appendChild(spanAuthor);
    
    let changeTitleButton = document.createElement(`button`);
    changeTitleButton.innerText = `Change Title`;
    changeTitleButton.className = `change-title`;
    
    changeTitleButton.addEventListener(`click`, () => changeTitle(listTitle, spanTitle, listAuthor, spanAuthor, id));
    
    let changeAuthorButton = document.createElement(`button`);
    changeAuthorButton.innerText = `Change Author`;
    changeAuthorButton.className = `change-author`;
    
    changeAuthorButton.addEventListener(`click`, () => changeAuthor(listAuthor, spanAuthor, listTitle, spanTitle, id));
    
    let removeButton = document.createElement(`button`);
    removeButton.innerText = `Remove book`;
    removeButton.className = (`remove-book`);
    
    removeButton.addEventListener(`click`, () => deleteBook(id, book));
    
    book.appendChild(listTitle);
    book.appendChild(listAuthor);
    book.appendChild(listUpdated);
    
    book.appendChild(changeTitleButton);
    book.appendChild(changeAuthorButton);
    book.appendChild(removeButton);
    
    bookGrid.appendChild(book);
    }


    async function deleteBook(id, book){
        const removeUrl = baseUrl + `?key=` + theKey + `&op=delete&id=` + id;
        
        let deleteCount = 1;
        for(let i=0; i<5; i++){
            const response = await fetch(removeUrl);
            const data = await response.json();
            if (data.status === `success`){
                bookGrid.removeChild(book);
                let successMessage = document.createElement(`li`);
                successMessage.className = `success`;
                successMessage.innerText = `Attempt # ` + deleteCount + ` Deleted book succesfully!`;
                statusMessage.appendChild(successMessage);
                updateScroll();
                break;
            }else {
                let error = data.message;
                let failMessage = document.createElement(`li`);
                failMessage.className = `fail`;
                failMessage.innerText = `Attempt # ` + deleteCount + ` Seems like something went wrong: ` + error;
                statusMessage.appendChild(failMessage);
                updateScroll();
            }
            deleteCount++;
            
        }
    };


    async function changeTitle (listTitle, spanTitle, spanAuthor, id)  {

        let startTitle = spanTitle.innerText;
        let startAuthor = spanAuthor.innerText;

        let changeTitleInput = document.createElement(`input`);
        changeTitleInput.className = `change-title`
        changeTitleInput.placeholder = startTitle;

        let okButton = document.createElement(`button`);
        okButton.className = `ok-button`;
        okButton.innerText = `Ok!`;

        listTitle.removeChild(spanTitle);
        listTitle.appendChild(changeTitleInput);
        listTitle.appendChild(okButton);

        okButton.addEventListener(`click`, async() => {
            let newTitle = changeTitleInput.value;
            let changeTitleUrl = baseUrl + `?key=` + theKey + `&op=update` + `&id=` + id + `&title=` + newTitle + `&author=` + startAuthor;
            if (newTitle === ``) {
                spanTitle.innerText = startTitle;
                listTitle.removeChild(changeTitleInput);
                listTitle.appendChild(spanTitle);
                listTitle.removeChild(okButton);
            }else {
            let changeTitleCount = 1;
            for(let i=0; i<5; i++){
                const response = await fetch(changeTitleUrl);
                const data = await response.json();
                if (data.status === `success`){
                    let successMessage = document.createElement(`li`);
                    successMessage.className = `success`
                    successMessage.innerText = `Attempt # ` + changeTitleCount + ` Changed book succesfully!`;
                    statusMessage.appendChild(successMessage);
                    updateScroll();
                    listTitle.removeChild(okButton);
                    listTitle.removeChild(changeTitleInput);
                    spanTitle.innerText = newTitle;
                    listTitle.appendChild(spanTitle);
                    break;
                }
                else {
                    let error = data.message;
                    let failMessage = document.createElement(`li`);
                    failMessage.className = `fail`;
                    failMessage.innerText = `Attempt # ` + changeTitleCount + ` Seems like something went wrong: ` + error;
                    statusMessage.appendChild(failMessage);
                    updateScroll();
                }
                changeTitleCount++;
            }
        }
        });
    };

    async function changeAuthor (listAuthor, spanAuthor, spanTitle, id)  {

        let startAuthor = spanAuthor.innerText;
        let startTitle = spanTitle.innerText;

        let changeAuthorInput = document.createElement(`input`);
        changeAuthorInput.className = `change-author`;
        changeAuthorInput.placeholder = startAuthor;

        let okButton = document.createElement(`button`);
        okButton.className = `ok-button`;
        okButton.innerText = `Ok!`;

        listAuthor.removeChild(spanAuthor);
        listAuthor.appendChild(changeAuthorInput);
        listAuthor.appendChild(okButton);

        
        okButton.addEventListener(`click`, async() => {
            let newAuthor = changeAuthorInput.value;
            let changeAuthorUrl = baseUrl + `?key=` + theKey + `&op=update` + `&id=` + id + `&title=` + startTitle + `&author=` + newAuthor;
        
            if (newAuthor === ``) {
                spanAuthor.innerText = startAuthor;
                listAuthor.removeChild(changeAuthorInput);
                listAuthor.appendChild(spanAuthor);
                listAuthor.removeChild(okButton);

            }else {
            let changeAuthorCount = 1;
            for(let i=0; i<5; i++){
                const response = await fetch(changeAuthorUrl);
                const data = await response.json();
                if (data.status === `success`){
                    let successMessage = document.createElement(`li`);
                    successMessage.className = `success`
                    successMessage.innerText = `Attempt # ` + changeAuthorCount + ` Changed book succesfully!`;
                    statusMessage.appendChild(successMessage);
                    updateScroll();
                    listAuthor.removeChild(okButton);
                    listAuthor.removeChild(changeAuthorInput);
                    spanAuthor.innerText = newAuthor;
                    listAuthor.appendChild(spanAuthor);
                    break;
                }
                else {
                    let error = data.message;
                    let failMessage = document.createElement(`li`);
                    failMessage.className = `fail`;
                    failMessage.innerText = `Attempt # ` + changeAuthorCount + ` Seems like something went wrong: ` + error;
                    statusMessage.appendChild(failMessage);
                    updateScroll();
                }
                changeAuthorCount++;
            }
        }
        });
    };

    function updateScroll(){
        var element = document.querySelector(`.error-log`);
        element.scrollTop = element.scrollHeight;
    }

});



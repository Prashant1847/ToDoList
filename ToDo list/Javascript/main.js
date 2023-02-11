

//code to target all list section from above three bars button
const allList_div_outer = document.querySelector('.all-list-container-outer');
const Thee_bar_butotn = document.querySelector('.threeBars-icon');
Thee_bar_butotn.addEventListener('click', hideOrshow_allLists);


function PlaygoOutAnimation() {
    //changed the animation of list container 
    allList_div_outer.style.animation = "goOut 1s ease 0s 1 forwards";
}

function SetComeInAnimation() {
    allList_div_outer.style.animation = "comeIn 1s ease 0s 1";
}

function hideOrshow_allLists() {
    const displayProperty = allList_div_outer.style.display;
    if (displayProperty === '') {
        PlaygoOutAnimation();
        setTimeout(() => {
            allList_div_outer.style.display = "none";
        }, 1000);
    } else {
        SetComeInAnimation(); //changing back to the original animation
        allList_div_outer.style.removeProperty('display');
    }
}

//end 

// list to all to do list code 
const All_list_Array = [];
const AllList_addIcon = document.getElementById('AllList_addIcon');
const AllList_UlList = document.getElementById('AllList-ul');
const AllList_searchBar = document.getElementById('AllList-searchBar');
let currentListObj;   //this will be the current selected list object we are working on

AllList_addIcon.addEventListener('click', ()=> createToDoListWithSearchBar(AllList_searchBar, true));

AllList_searchBar.addEventListener('keydown', (event)=>{
    if(event.key == 'Enter')  createToDoListWithSearchBar(AllList_searchBar, true);
});

function toDo_list(name){
    this.name = name;
    this.pendingTask = 0;
    this.checkedTask = 0;
    this.checkedTaskList = [];
    this.totalTask = 0;
    this.ListOfTask  = [];
}


function createToDoListObject(name){
    return new toDo_list(name);
}

function getCurrentListObject(){
    return currentListObj;
}

function setCurrentListObject(object){
    currentListObj = object;
}

//code for getting and saving the data in local storage

function saveData(){
    localStorage.setItem('allList', JSON.stringify(All_list_Array));
}

(function loadData(){
    const dataofAllList =  JSON.parse(localStorage.getItem('allList'));
    if(dataofAllList == null){
        createToDoListWithName('Default List', true);
        setCurrentListObject(All_list_Array[0]);
    } else for(let list of dataofAllList) createToDoListWithObject(list, false); // creating object from local storage 
    // data
}());

function createToDoListWithName(name, toSave){
    makeLiElementWithListner(name);
    ifchangeAndSaveList(toSave, createToDoListObject(name));
}

function createToDoListWithObject(object, toSave){
    makeLiElementWithListner(object.name);
    ifchangeAndSaveList(toSave, object);
}

function createToDoListWithSearchBar(searchBar, toSave){
    makeLiElementWithListner(searchBar.value);
    ifchangeAndSaveList(toSave, createToDoListObject(searchBar.value));
    searchBar.value = null;
}

function ifchangeAndSaveList(toSave, listObject){
    All_list_Array.push(listObject)
    if(!toSave) return;
    
    changeList(null, listObject); //not changing the list when saving data is false
    saveData();
}



function makeLiElementWithListner(StringtoAdd){
    if(StringtoAdd == ''){
        alert('Please enter some value frmo makelist element');
    } else{
        const list = document.createElement('li');
        list.innerHTML = StringtoAdd; 
        list.addEventListener('click', (event)=> changeList(event));
        AllList_UlList.append(list);
    }
}

//this function works both for when triggered by even and by giving object to change to
function changeList(event ,changeToThisList = {}){
    let listObjInArray;
    if(event != null){
        const list = event.target;
        const listText = list.textContent;

        for(const listObj of All_list_Array){
            if(listObj.name == listText) listObjInArray = listObj;
        }
    } else listObjInArray = changeToThisList;
    
    setCurrentListObject(listObjInArray);

    const storedArray = listObjInArray.ListOfTask;
    const listTitle = document.querySelector('#todo-list-Title');
    listTitle.textContent = listObjInArray.name; //changing the list title
    reBuildTodoList();
    const newUl_list = document.querySelector('#toDo-list');
    fillList(storedArray, newUl_list, true);

    //update features
    updateFeatures(listObjInArray);
}

function reBuildTodoList(){
    document.getElementById('toDo-list').remove();  //removing the current to-do list to replace it with another
    
    const listContainer = document.querySelector('.list-container');//this is where the ul list resides
    const newUl_list = document.createElement('ul');
    newUl_list.setAttribute('id', 'toDo-list');

    listContainer.append(newUl_list);
}



function updateFeatures(listObject){
    document.querySelector('.pending-task').textContent =  listObject.pendingTask;
    document.querySelector('.total-task').textContent = listObject.totalTask;
    document.querySelector('.Checked-task').textContent = listObject.checkedTask;
}

function checkListOnLoad(liElement){
    for(let checkedString of getCurrentListObject().checkedTaskList){ // cureenelit obhject was there
        if(liElement.textContent === checkedString) {
            liElement.getElementsByTagName('span')[0].classList.add('checked');
            liElement.firstChild.checked = true;//checkbox is first child
        }
    }
}

function addListnertoCheckbox(checkbox){
    checkbox.addEventListener('click', checkOrUncheckListAndUpdateData);
    checkbox.addEventListener('keydown', (event) => {
        if(event.key == 'Enter'){
            if(checkbox.checked) checkbox.checked = false;
            else checkbox.checked = true;
            checkOrUncheckListAndUpdateData(event);
        }
    })
}

function fillList(listArray, ul_list, toCheckList = false){
    for(const stringToAdd of listArray){
        const list = document.createElement('li');
        list.innerHTML = '<input type = "checkbox"><span>'+stringToAdd+'</span>'; //creating list with checbox and string
        const checkbox = list.firstChild;
        addListnertoCheckbox(checkbox);

        if(toCheckList) checkListOnLoad(list);
        ul_list.append(list);
    }
}

//these two belong to the to-do list 
const addIcon =document.getElementById('add-icon'); 
const SearchBar = document.getElementById('list-searchBar');



SearchBar.addEventListener('keydown', (event)=>{
    if(event.key == 'Enter') addNewList(null, SearchBar);
});

addIcon.addEventListener('click',() => addNewList(null, SearchBar) );


function addNewList(listString, searchBar) {
    const UlList = document.getElementById('toDo-list');
    let StringtoAdd;
    if(searchBar != null){
        StringtoAdd = searchBar.value;
        searchBar.value = null;
    } else  StringtoAdd = listString;
    
    if(StringtoAdd == ''){
        alert('Please enter some value');
    } else if(getCurrentListObject() != undefined){ //if no object is in the storage do not allow to create list
        const list = document.createElement('li');
        list.innerHTML = '<input type = "checkbox"><span>'+StringtoAdd+'</span>'; //creating list with checbox and string
        addListnertoCheckbox(list.firstChild);
        UlList.append(list);

        //updating data
       UpdateDataOnAddList(StringtoAdd);
    }
}


function UpdateDataOnAddList(StringtoAdd){
    getCurrentListObject().ListOfTask.push(StringtoAdd);
    changeAndShowPendingTask(); 
    changeAndShowTotalTask();
    saveData();
}



function checkOrUncheckListAndUpdateData(event){
    const checkbox = event.target;
    const list = checkbox.parentElement;
    const spanTag = list.getElementsByTagName('span')[0];
    const checkedlistArray = getCurrentListObject().checkedTaskList;

    if(spanTag.classList.contains('checked')){
        spanTag.classList.remove('checked');
        spanTag.classList.add('Unchecked');

        //also removing the checked list from the current list object and updating the tasks
        const indexOfCheckedList = checkedlistArray.indexOf(list.textContent);
        checkedlistArray.splice(indexOfCheckedList, 1);
        changeAndShowCheckedTask(-1);
        changeAndShowPendingTask();
    } else{
        spanTag.classList.add('checked');
        spanTag.classList.remove('Unchecked');
        checkedlistArray.push(list.textContent);
        changeAndShowCheckedTask();
        changeAndShowPendingTask(-1);
    }
}



//code for adding features like delete pending task and all

 document.querySelector('.delete-icon').addEventListener('click', deleteCompleteList);
 document.querySelector('.delete-icon-container').addEventListener('click', deleteCheckedList);

 const pending_div = document.querySelector('.pending-task');
 const totalTask_div = document.querySelector('.total-task');
 const checked_div = document.querySelector('.Checked-task');

function deleteCompleteList(){
    const index = All_list_Array.indexOf(getCurrentListObject());
    //removing the list 
    for(let list of AllList_UlList.getElementsByTagName('li')){
        if(list.textContent == getCurrentListObject().name) list.remove();
    }

    All_list_Array.splice(index, 1);
    //resetting the current object based on remaining length of array
    const remainingLength = All_list_Array.length;

    if(remainingLength == 0) setCurrentListObject({
        name: '',
        ListOfTask: []
    }); 
    else if(All_list_Array.length == 1) setCurrentListObject(All_list_Array[0]);
    else  setCurrentListObject(All_list_Array[index + 1]);

    changeList(null, getCurrentListObject()); 
    saveData();
}


function deleteCheckedList(){
    const currentObject = getCurrentListObject();
    const toremoveFromArray = currentObject.ListOfTask;
    const numOfcheckedTask = currentObject.checkedTask;

    for(const checkedListString of currentObject.checkedTaskList){
        const listIndex = toremoveFromArray.indexOf(checkedListString);
        toremoveFromArray.splice(listIndex, 1);
    }
    //updating the data and list 
    currentObject.checkedTaskList = []; // clearing the stores checked list
    reBuildTodoList();
    const UlList = document.querySelector('#toDo-list');
    fillList(toremoveFromArray, UlList ,true)
    changeAndShowCheckedTask(-numOfcheckedTask);
    changeAndShowTotalTask(-numOfcheckedTask);
    saveData();
}





function changeAndShowPendingTask(value = 1){
    pending_div.textContent = (getCurrentListObject().pendingTask += value);
    saveData();
}

function changeAndShowTotalTask(value = 1){
    totalTask_div.textContent = (getCurrentListObject().totalTask += value);
}

function changeAndShowCheckedTask(value = 1){
    checked_div.textContent = (getCurrentListObject().checkedTask += value);
    saveData();
}































//  --> setting array for all the to do list
//  --> to do list will be an object container 
        // name, pandingtast, completedtast, totaltask and array for work to do 
        // features
    // deleting an to do list 
    // renaming to do list 
    // adding new list 
    //cross animation when checked `




//when deleted object will be pushed out of the array 
// current to do list can be accessed by the array of objects 
// using checkbox in after element and getting the list and content of it and crossing it's conten


////////////////////////
// to check how append child works 
import "./lib/dom.js";
import "./lib/storage.js";
import { getStorage, setStorage } from "./lib/storage.js";
import { insertLast, getNode } from "./lib/dom.js";

// save시 Prettier가 작동하도록 설정되어 있으면 아마도 한 줄로 다 엮어버릴 거에요.
// 저는 그냥 Shift + Alt + F 눌렀을 때만 작동하도록 설정해뒀습니다.

let inputForm = getNode("#add-todo-form");
let input = getNode("#add-todo-input");
let todoListUl = getNode("#todo-list-ul");

const dateObj = new Date();

//input submit
// form submit 처리 방지
inputForm.addEventListener("submit", handleTodoList);

//delete btn click
//document에 optionalBtn이 renderItem함수 실행 이후 생성되므로, 처음부터 작성되어있던 ul에 이벤트를 위임하고 if문을 통해 삭제버튼에만 이벤트가 발생하도록 작성
todoListUl.addEventListener("click", function (e) {
  if (e.target.closest(".todo-list-optional")) {
    handleRemove(e);
  }
});
/*
getNode()로 불러온 버튼이 아닌 class명으로 작성하는 이유
class는 해당 클래스가 있는 버튼을 다 찾아줘
getNode()는 그중 첫번째 하나만 줘 인데
아직 그 버튼이 등장도 안했다면 못찾아서 오류가 발생함
*/

//1. inputForm이 제출되었을때
// 입력값 읽기, 배열 저장, li 생성 및 목록 추가, localStorage 저장 처리
function handleTodoList(e) {
  e.preventDefault();
  //입력값을 읽기
  let newTodoObj = {
    id: self.crypto.randomUUID(),
    contents: input.value,
    date: dateObj,
    complete: false,
  };
  //배열 저장 및 localstorage에 추가
  addItemArray(newTodoObj);

  //li 생성 및 목록 추가
  renderItem({
    target: todoListUl,
    value: newTodoObj.contents,
    id: newTodoObj.id,
  });
}

// 완료 탭으로 이동
function moveToCompleteTab(e) {
  //filter
  // const completeArray = todoListArray.filter((obj)=>obj.complete===true)
}

// 미완료 탭으로 이동
function moveToImCompleteTab() {}

// 3. 할 일 항목을 문자열로 생성
function createItem(value, id) {
  let htmlString = `
    <li id=${id} class="todo-list-cell">
            <div class="align-wrap">
              <button class="todo-list-complete-btn">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_35_88)">
                    <path
                      d="M12 2C6.47 2 2 6.47 2 12C2 17.53 6.47 22 12 22C17.53 22 22 17.53 22 12C22 6.47 17.53 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z"
                      fill="#A4A4A4"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_35_88">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </button>
              <div class="todo-list-text">${value}</div>
            </div>
            <div class="align-wrap">
            <div class="todo-list-date">${
              dateObj.getMonth() + 1
            }월 ${dateObj.getDate()}일</div>
            <button type="button" class="todo-list-optional">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 9V11H15V9H5ZM10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z"
                  fill="#FF6969"
                />
              </svg>
            </button>
            </div>
          </li>
    `;
  return htmlString;
}

//4. `createItem`을 사용해 생성된 `<li>`를 `target` 요소의 맨 뒤에 추가함 (ul 목록 안에 li가 삽입되는 구조)
function renderItem({ target, value, id }) {
  insertLast(target, createItem(value, id));
}

//8. 해당 data-id를 가진 <li> 요소를 찾아 DOM에서 제거
function removeItem(id) {
  /*아래의 코드는 리스트의 첫번째 li만 비교하고있기 때문에 오류 발생??
    if(todoListUl.querySelector('li').id===id){
        todoListUl.querySelector('li').remove()
    }
    */
  const li = todoListUl.querySelector("li");
  //배열이면 forEach 쓰면 좋을꺼같은데..
  console.log();
}

// 2. 새로운 할 일을 todoListArray에 객체 형태로 추가 + localStorage 저장
function addItemArray(todoListObj) {
  let todoListArray = getStorage();

  todoListArray.push(todoListObj);
  input.value = "";

  //localStorage 저장처리
  setStorage(todoListArray);
}

//7. 배열에서 해당 id와 일치하는 항목을 제거 (filter 사용)
function removeItemArray(id) {
  let todoListArray = getStorage();
  todoListArray = todoListArray.filter((todoList) => todoList.id !== id);
  setStorage(todoListArray);
}

//6. <ul> 안에서 항목을 클릭하면 실행됨
// 해당 항목을 제거하고, 배열에서도 삭제하며, localStorage 업데이트
function handleRemove(event) {
  //해당 항목 제거
  removeItem(event.target.closest("li").id);

  //배열에서 삭제하면서 localStorage에 업데이트
  // li를 찾기위해선 parentNode 중첩이 필요(event.target.parentNode.parentNode.parentNode.id) closest(selector)를 사용하면 가장 가까운 상위 요소 중 해당 선택자에 맞는 걸 찾아준다
  removeItemArray(event.target.closest("li").id);
}

//5. 페이지가 로드되었을 때 실행
// localStorage에서 기존 todo 데이터를 불러와 목록 복원
function init() {
  let todoListArray = getStorage();
  if (todoListArray !== null) {
    todoListArray.forEach((element) => {
      renderItem({
        target: todoListUl,
        value: element.contents,
        id: element.id,
      });
    });
  }
}
window.addEventListener("load", () => init());

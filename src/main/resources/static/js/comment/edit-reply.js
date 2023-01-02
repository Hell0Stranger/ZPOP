import {getReply, removeTextBox} from "./reply.js";

export function addListenerToReplyKebob(replyId, replyUl,selectModal){
   
    if(selectModal.children[0].getAttribute("data-id")=='comment-edit'){
	   console.log("여기")
	   selectModal.children[0].addEventListener("click",(e)=>{
         e.preventDefault();
         const profile = selectModal.parentElement;
         editReply(replyId, replyUl, profile);
        });
   }
   if(selectModal.children[1].getAttribute("data-id")=='comment-delete'){
	   selectModal.children[1].addEventListener("click",(e)=>{
         e.preventDefault();
         deleteReply(replyId, replyUl);
        });
   }
   if(selectModal.children[0].getAttribute("data-id")=='comment-report'){
	    selectModal.addEventListener("click",(e)=>{
         e.preventDefault();
         reportReply(replyId, 3, "그냥 맘에 안듬");//신고유형&이유 모달 붙여야함.
      });
   }
}

function editReply(replyId, replyUl, profile){
	removeTextBox("multi");
	const replyContainer = profile.nextElementSibling;
	const linkContainer = replyContainer.nextElementSibling;
	linkContainer.classList.add("hidden");
	replyContainer.classList.add("hidden");
	let template =  // text input box를 동적으로 추가 
			`
              <div class="reply__input-container"> 
                  <textarea
                      id="reply-text"
                      class="reply__input"
                      name="reply-input"></textarea>
                  <div class="reply__btn-container">
                      <span class="reply__btn btn btn-round cancel-btn">취소하기</span>
                      <span class="reply__btn btn btn-round save-reply-edit"  >저장하기</span>
                  </div>
              </div> 
                   `;
		//클릭된 특정 답글링크의 위치아래에 inputbox추가.    
		linkContainer.insertAdjacentHTML("afterend", template);
		const inputBox = document.querySelector("#reply-text");
		const text = replyContainer.children[1].innerText.trim();
		inputBox.focus();
		inputBox.value="";
		inputBox.value = text+ " ";
		
		const editSaveBtn = document.querySelector(".save-reply-edit");
		editSaveBtn.addEventListener("click",()=>{
			saveEdit(replyId,replyUl,inputBox);
		});
}

function saveEdit(replyId,replyUl,inputBox){
   const editedText = inputBox.value;
   const data = {
      method: "PATCH",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify({
         "id": replyId,
         "content": editedText 
      })
   };
   if(editedText==""){
       alert("답글을 입력해주세요.");
       return;
   }
   
   fetch(`/reply/${replyId}`, data)
      .then(response => {
            if (response.ok) {
				
				return response;
            }
            else alert("시스템 장애로 등록이 안되고 있습니다.");
      })
      .then(data => data.json())
	  .then(json => {
		  while(replyUl.hasChildNodes()) //기존 댓글 한개씩 삭제
              replyUl.removeChild(replyUl.firstChild);
          getReply(json,replyUl) //json값은 백단에서 받아오는 groupId
	  });
}

function deleteReply(replyId, replyUl){
   const data = {
      method: "DELETE",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify({
         "id": replyId,
      })
   };
   
   fetch(`/reply/${replyId}`, data)
      .then(response => {
            if (response.ok) {
				return response;
            }
            else alert("시스템 장애로 등록이 안되고 있습니다.");
      })
      .then(data => data.json())
	  .then(json => {
		  while(replyUl.hasChildNodes()) //기존 댓글 한개씩 삭제
              replyUl.removeChild(replyUl.firstChild);
          getReply(json,replyUl) //json값은 백단에서 받아오는 groupId
	  });
}
function reportReply(replyId, reportType, reportReason){
   const data = {
      method: "PUT",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify({
         "commentId": replyId,
         "typeId":reportType,
         "reason":reportReason
      })
   };
   
   fetch(`/reply/${replyId}`, data)
      .then(response => {
         if (response.ok) {
			 console.log("성공")
            return response;
         }
         else alert("시스템 장애로 등록이 안되고 있습니다.");
      })
      .then(data=>data.json())
      .then(json=>{
         
      });
}
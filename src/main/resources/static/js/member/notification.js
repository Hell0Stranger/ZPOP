function sendAll(){
		const notifications = document.querySelectorAll(".notification");
		
		if(notifications.length==1)
			return;
			
		for(n of notifications){
			if(n.getAttribute("data-type")==1){
				const type = 1;
				const readAt = true;
				const data = {
	                method: "POST",
	                headers: {
	                    "Content-Type": "application/json",
	                },
	                body: JSON.stringify({
						readAt,
	                    type
	              	  })
	           	 }
				fetch("http://localhost:8080/notification/type", data)				
				continue;
			}
			 const id = n.getAttribute("data-id");
			 const readAt = true;	
			 const data = {
	                method: "POST",
	                headers: {
	                    "Content-Type": "application/json",
	                },
	                body: JSON.stringify({
						id,
	                    readAt
	                })
	            }
			fetch("http://localhost:8080/notification/read", data)	
		}
	}

	function readAll(){
		const headerNotification = document.querySelector("#header-notification");
		const notificationCancelBtn = document.querySelector(".readAll-btn");
		const upperBlank = document.querySelector("#upper-blank");
		const notifications = document.querySelectorAll(".notification");
		//알림이 모두 없애기
		headerNotification.classList.remove("header__notification-on");
		headerNotification.classList.add("header__notification");
		
		for(const n of notifications)
			n.remove();	
		
		// 안내문구 추가
		let template=`<div class="notification" style="font-size: 20px; border:none; cursor:default; height:250px; line-height: 250px; text-align: center; color:#8B8B8B;">알림이 없습니다!</div>`;
		upperBlank.insertAdjacentHTML("afterend",template);
		notificationCancelBtn.classList.add("deactivated-btn");
		notificationCancelBtn.innerHTML="모두 읽음";
	}

	function readOne(e){
		e.preventDefault();
		let deleteTarget = e.target;
		for (deleteTarget; !deleteTarget.classList.contains('notification');
			deleteTarget = deleteTarget.parentElement);
			
		let notificationModal = deleteTarget.parentElement;
		notificationModal.removeChild(deleteTarget);
		
		const notifications = document.querySelectorAll(".notification");
		if(notifications.length == 0)
			readAll();
		
		 const id = deleteTarget.getAttribute("data-id");
		 const readAt = true;	
		 const data = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
					id,
                    readAt
                })
            }
			
		fetch("http://localhost:8080/notification/read", data)
		.then(response=>{
			window.location.href=deleteTarget.getAttribute("data-url");
		})
	}

    window.addEventListener("load", (e) => {
        const notificationBtn = document.querySelector("#notification-btn");
		const notificationCancelBtn = document.querySelector(".readAll-btn");
		const modalCloseBtn = document.querySelector(".modal-close-btn-div");
		const upperBlank = document.querySelector("#upper-blank");
		const headerNotification = document.querySelector("#header-notification");
		const type = [];
		
		 fetch("http://localhost:8080/notification")
		            .then((response) => {
						return response.json();
					})
					.then((data)=>{
						for (let d of data){
							
							switch(d.type){
								case 1: typeStatement = "😃 평가하지 않은 모임이 있어요 !";
									break;
								case 2: typeStatement = "😃 내 모임에 새로운 참여자가 있어요 !";
									break;
								case 3: typeStatement = "💬 내 모임에 댓글이 달렸어요 !";
									break;
								case 4: typeStatement = "💬 내 댓글에 답글이 달렸어요 ! ";
									break;
							}
							// 배열에 타입을 넣어주기
							type.push(d.type);
							
							if(d.type!=1){
								let div = document.createElement("DIV");
								div.classList.add("notification");
								div.onclick = readOne;
								div.innerHTML=`${typeStatement}<p>${d.elapsedTime}</p>`;
								div.setAttribute("data-id",d.id);
								div.setAttribute("data-url",d.url);
								upperBlank.insertAdjacentElement('afterend', div);
							}
						}
						
						// 알림 아이콘 변경 
						const notification = document.querySelectorAll(".notification");
						if(notification.length!=0){
							headerNotification.classList.remove("header__notification");
							headerNotification.classList.add("header__notification-on");
						}
						else if(notification.length==0)
							readAll();
						
						
					if(type.includes(1)){
							var count = 0;
							for(t of type)
								if(t==1)
									count++;
							
							let template = `
							<div class="notification eval-div" data-type ="1" data-url="/report/comment">😃 평가하지 않은 모임이 ${count}개 있어요 !<p>이동하기</p></div>
							`;
							upperBlank.insertAdjacentHTML('afterend',template);
						    const evalDiv = document.querySelector(".eval-div");
							evalDiv.addEventListener("click",(e)=>{
								e.preventDefault();
								let deleteTarget = e.target;
								for (deleteTarget; !deleteTarget.classList.contains('notification');
									deleteTarget = deleteTarget.parentElement);
									
								let notificationModal = deleteTarget.parentElement;
								notificationModal.removeChild(deleteTarget);
								
								const type = 1;
								const readAt = true;
								const data = {
					                method: "POST",
					                headers: {
					                    "Content-Type": "application/json",
					                },
					                body: JSON.stringify({
										readAt,
					                    type
					              	  })
					           	 }
								fetch("http://localhost:8080/notification/type", data)
								.then(response=>{
									window.location.href=deleteTarget.getAttribute("data-url");
								})
								
							});
						}
					})
		  			.catch((error) => console.log(error));
        
        // 모두 읽기 버튼
        notificationCancelBtn.addEventListener("click",(e)=>{
			 e.preventDefault();
			 sendAll();
			 readAll();
		})
    });
detailView();

const toastLiveExample = document.querySelector("#liveToast");
const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
const toastBody = document.querySelector(".toast-body");

function detailView() {
    const url = window.location.href;
    const postingId = url.substring(url.lastIndexOf("/") + 1);
    fetch(`/api/user/posting/${postingId}`)
        .then(response => response.json())
        .then(data => {
            const posting = data.posting;
            const industryList = data.industryList;
            const topPostingList = data.topPostingList;

            const companyName = document.querySelector("#company-name");
            const title = document.querySelector("#title");
            const workConditionUl = document.querySelector("#work-condition-ul");
            const hiringCount = document.querySelector("#hiring_count");
            const industry = document.querySelector("#industry-id");
            const level = document.querySelector("#level");
            const requirements = document.querySelector("#requirements");
            const preferences = document.querySelector("#preferences");
            const benefits = document.querySelector("#benefits");
            const period = document.querySelector("#period");
            const etc = document.querySelector("#etc");

            const industryId = posting.industryId - 1;
            const industryName = data.industryList[industryId].industryName;

            const companyImage = document.querySelector("#company-image");
            const bucketInput = document.querySelector("#bucket-url");

            const bucketUrl = bucketInput.value;

            companyImage.innerHTML = "";

            if (posting.fileName.length > 0) {
                const imageHtml = `
                <img src="${bucketUrl}/company/${posting.companyId}/logo.png" style="max-width: 500px" class="img-fluid rounded-circle mx-auto d-block" alt="사진준비중">
            `;

                companyImage.innerHTML = imageHtml;
            }

            const h2Element = companyName.querySelector("h2");
            const aElement = companyName.querySelector("a");
            h2Element.innerHTML = posting.companyName;
            aElement.href = `/user/join/${posting.companyId}`;

            title.innerHTML = posting.title;

            workConditionUl.innerHTML = "";

            const conditionHtml = `
                <li>
                    <i class="fa-regular fa-square-check fa-2xl"></i>
                    <span>근무지: ${posting.address}</span>
                </li>
                <li>
                    <i class="fa-regular fa-square-check fa-2xl"></i>
                    <span>근무형태: ${posting.employmentType}</span>
                </li>
               <li>
                    <i class="fa-regular fa-square-check fa-2xl"></i>
                    <span>연봉: ${posting.salary}원</span>
                </li>
            `;

            workConditionUl.innerHTML = conditionHtml;

            hiringCount.value = posting.hiringCount + '명';

            industry.value = industryName;

            level.value = posting.experienceLevel + " " + posting.educationLevel;

            requirements.innerHTML = posting.requirement;
            resizeTextarea(requirements);

            preferences.innerHTML = posting.preference;
            resizeTextarea(preferences);

            benefits.innerHTML = posting.benefit;
            resizeTextarea(benefits);

            period.value = `${posting.startDate} ~ ${posting.endDate}`;

            const textAreaElement = etc.querySelector("textarea");
            if (posting.etc != null && posting.etc != '없음') {
                textAreaElement.innerHTML = posting.etc;
                resizeTextarea(etc);
            } else {
                etc.classList = "d-none";
            }

            const senderId = data.senderId;
            const recipientId = posting.memberId;

            const auth = data.auth;
            const applyCheck = data.applyCheck;

            //쪽지 처리
            const noteBtn = document.querySelector("#note-btn");
            if (senderId === "notLogin") {
                noteBtn.addEventListener("click", function () {
                    toastBody.innerHTML = "로그인 후 이용해주세요!";
                    toastBootstrap.show();
                });
            } else {
                // 쪽지보내기 이벤트 넣기
                noteBtn.addEventListener("click", function () {
                    const Url = `/note/write?senderId=${senderId}&recipientId=${recipientId}`
                    window.open(Url, '_blank', 'width=600,height=400');
                });
            }

            // 찜 상태 표시
            const wishBtn = document.querySelector("#wish-btn");

            if (posting.scraped) {
                wishBtn.innerHTML = "<i class=\"fa-regular fa-star\"></i> 공고찜취소";
                wishBtn.classList = "btn btn-outline-danger";
            } else {
                wishBtn.innerHTML = "<i class=\"fa-regular fa-star\"></i> 공고찜하기";
                wishBtn.classList = "btn btn-outline-warning";
            }
            wishBtn.addEventListener("click", wish);
            const applicationBtn = document.querySelector("#application-btn");

            if (auth === "admin" || auth === "company" || auth === "recruiter") {
                applicationBtn.classList.add("d-none");
                wishBtn.classList.add("d-none");
                noteBtn.classList.add("d-none");
            }

            if (applyCheck) {
                applicationBtn.classList.add("d-none");
            }

            const industrySide = document.querySelector('#industry-side');

            industrySide.innerHTML = "";

            industryList.forEach(industry => {
                const industrySideHtml = `
                  <li><a class="justify-content-between d-flex" href="/user/posting/list?industrIds=${industry.industryId}"><p>${industry.industryName}</p>
                    <span>${industry.count}</span></a></li>
                `;

                industrySide.insertAdjacentHTML('beforeend', industrySideHtml);
            });

            const applicationSide = document.querySelector("#application-side");
            applicationSide.innerHTML = "";

            topPostingList.forEach(topPosting => {
                const topHtml = `
                    <li><a class="justify-content-between d-flex" href="/user/posting/${topPosting.postingId}"><p>${topPosting.title}</p>
                            <span>${topPosting.applicationCount}명</span></a></li>
                `;

                applicationSide.insertAdjacentHTML('beforeend', topHtml);
            });

        })
        .catch(error => {
            alert("문제가 발생했습니다. 관리자에게 문의해주세요");
        });
}

// textarea의 내용이 변경될 때마다 크기 조정
function resizeTextarea(textarea) {
    textarea.style.height = 'auto'; // 먼저 기존의 높이를 초기화
    textarea.style.height = textarea.scrollHeight + 'px'; // 내용의 높이에 따라 새로운 높이를 설정
}

function wish() {
    const url = window.location.href;
    const postingId = url.substring(url.lastIndexOf("/") + 1);
    fetch(`/scrap/${postingId}`, {
        method: "POST"
    })
        .then(response => response.json())
        .then(data => {
            const scraped = data.scraped;
            const wishBtn = document.querySelector("#wish-btn");
            if (scraped === true) {
                wishBtn.innerHTML = "<i class=\"fa-regular fa-star\"></i> 공고찜취소";
                wishBtn.classList = "btn btn-outline-danger";
            } else {
                wishBtn.innerHTML = "<i class=\"fa-regular fa-star\"></i> 공고찜하기";
                wishBtn.classList = "btn btn-outline-warning";
            }
        })
        .catch(error => {
            toastBody.innerHTML = "로그인 후 이용해주세요!";
            toastBootstrap.show();
        });
}

const applicationBtn = document.querySelector("#application-btn");
applicationBtn.addEventListener("click", function () {
    const url = window.location.href;
    const postingId = url.substring(url.lastIndexOf("/") + 1);
    const titleInput = document.querySelector("#title");
    const title = titleInput.innerHTML;

    fetch(`/api/user/posting/application/${postingId}`)
        .then(response => response.json())
        .then(data => {
            let dateCheck = data.dateCheck;
            let countCheck = data.countCheck;

            if (dateCheck && countCheck) {
                const Url = `/user/posting/application?postingId=${postingId}&title=${title}`
                window.open(Url, '_blank', 'width=1000,height=700');
            } else if (dateCheck !== true) {
                toastBody.innerHTML = "입사 지원 가능 날짜가 지났습니다!!";
                toastBootstrap.show();
            } else if (countCheck !== true) {
                toastBody.innerHTML = "지원가능한 수가 초과하였습니다!!";
                toastBootstrap.show();
            }
        })
        .catch(error => {
            toastBody.innerHTML = "로그인 후 이용해주세요!";
            toastBootstrap.show();
        });
});

// 메시지 수신 시 동작할 함수 정의
function handleMessage(event) {
    if (event.data === "applicationCompleted") {
        // 작업 완료 메시지 수신 시 메인 페이지 새로고침
        window.location.reload();
    }
}

// 메시지 이벤트 리스너 등록
window.addEventListener("message", handleMessage);

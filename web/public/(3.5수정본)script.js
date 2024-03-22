document.getElementById('send-button').addEventListener('click', function() {
    const userInputField = document.getElementById('user-input');
    const userInput = userInputField.value;
    sendToServer(userInput);
    userInputField.value = ''; // 메시지 전송 후 입력 필드 초기화
});

async function sendToServer(message) {
    const responseElement = document.getElementById('dialogue-text');
    if (!message) return;

    responseElement.innerText = '대화를 불러오는 중...'; // 로딩 텍스트로 업데이트

    try {
        const response = await fetch('/execute-assistant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ asst_id: "your-assistant-id-here", content: message }) // asst_id를 추가
        });

        if (!response.ok) {
            throw new Error(`서버 오류: ${response.statusText}`);
        }

        const data = await response.json();
        responseElement.innerText = data.messages?.[0]?.content || '응답을 받지 못했습니다.'; // 응답 구조에 맞게 수정
    } catch (error) {
        console.error('대화를 가져오는데 문제가 발생했습니다:', error);
        responseElement.innerText = `죄송합니다, 오류가 발생했습니다: ${error.message}`;
    }
}

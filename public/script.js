document.getElementById('send-button').addEventListener('click', function() {
    const userInput = document.getElementById('user-input').value;
    sendToServer(userInput);
});

async function sendToServer(message) {
    const responseElement = document.getElementById('dialogue-text');
    if (!message) return;

    responseElement.innerText = '...'; // 로딩 텍스트로 업데이트

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            throw new Error('서버에서 대화를 가져오는데 문제가 발생했습니다.');
        }

        const data = await response.json();
        // 서버 응답 구조에 맞추어 수정
        responseElement.innerText = data.reply; // 'data.choices[0].text'에서 'data.reply'로 수정
    } catch (error) {
        console.error('대화를 가져오는데 문제가 발생했습니다:', error);
        responseElement.innerText = '죄송합니다, 오류가 발생했습니다.';
    }
}

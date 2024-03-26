const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// bodyParser를 사용하여 JSON 요청 본문 파싱 활성화
app.use(bodyParser.json());



let tasks = []; // 작업을 저장할 배열
// 새 작업 추가 함수
function addTask(newTask) {
    tasks.push(newTask);
}

// 엔드포인트의 구조는
// http://mydomain.com:port/maa/getTask
// ex) http://localhost:3000/maa/getTask
// ex) http://localhost:3000/maa/reportStatus

// getTask 엔드포인트 구현
app.post('/maa/getTask', (req, res) => {
    console.log('getTask 요청:', req.body);
    res.json({ tasks });
});

// 작업 상태 보고 엔드포인트
app.post('/maa/reportStatus', (req, res) => {
    console.log('reportStatus 요청:', req.body);
    // 여기에서 작업 실행 결과를 처리합니다. 예를 들어 데이터베이스에 저장할 수 있습니다.
    res.send('OK');
});

app.listen(port, () => {
    console.log(`서버가 ${port}번 포트에서 실행중입니다.`);
});

console.log("작동 테스트 1")
// 임시로 몇 가지 작업을 추가
addTask({
    id: "task1",
    type: "CaptureImage"
});
console.log("작동 테스트 2")
addTask({
    id: "task2",
    type: "LinkStart"
});







// http://localhost:3000/maa/getTask
// http://localhost:3000/maa/reportStatus
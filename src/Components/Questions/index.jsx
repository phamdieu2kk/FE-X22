import { useEffect, useState } from "react";
import SingleChoice from "../SingleChoice";
import MultipleChoice from "../MultipleChoice";
import { Button , Flex, Result, Modal } from "antd";
import "./style.css";
// import api from "../../api";
// import { useLocation } from "react-router-dom";

const Questions = () => {
    // const location = useLocation();
    // const queries = new URLSearchParams(location.search);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answerList, setAnswerList] = useState([]);
    const [timeLeft, setTimeLeft] = useState(180); // Thời gian còn lại ban đầu: 3 phút * 60 giây/phút
    const [timeUp, setTimeUp] = useState(false); 
    const [showResult, setShowResult] = useState(false); // Biến để kiểm soát hiển thị kết quả
    const [score, setScore] = useState(0); // State để lưu điểm số
    const [confirmSubmit, setConfirmSubmit] = useState(false); // State để kiểm soát xác nhận nộp bài
    const [isTimerRunning, setIsTimerRunning] = useState(true); // State để kiểm soát việc chạy thời gian

    useEffect(() => {
        (async () => {


               // try {
            //     const res = await api.getQuestion({
            //         queries: queries,
            //     });
            //     setQuestions(res.data); // Assuming res.data contains the questions
            // } catch (error) {
            //     console.error("Error fetching questions:", error);
            // }
            const res = await fetch("/test.json");
            const data = await res.json();
            console.log(data);
            setQuestions(data);
        })();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            if (isTimerRunning) {
                setTimeLeft((prevTimeLeft) => {
                    if (prevTimeLeft === 0) {
                        clearInterval(timer);
                        setTimeUp(true); // Đặt biến trạng thái thành true khi thời gian đếm ngược đạt 0
                        return prevTimeLeft;
                    } else {
                        return prevTimeLeft - 1;
                    }
                });
            } else {
                clearInterval(timer); // Dừng thời gian khi không chạy
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [isTimerRunning]);

    useEffect(() => {
        // Kiểm tra khi thời gian kết thúc nhưng vẫn còn câu hỏi chưa hoàn thành
        if (timeUp && currentIndex !== questions.length - 1) {
            handleSubmitButtonClick(); // Tự động chuyển sang trang kết quả
        }
    }, [timeUp, currentIndex, questions]);
    
   


    const changeAnswer = (data) => {
        const newAnswerList = answerList.filter(
            (answer) => answer.questionId !== data.questionId
        );

        switch (data.type) {
            case "single-choice":
                newAnswerList.push(data);
                break;
            default:
                break;
            case "multiple-choice":
                if (data.answers.length > 0) {
                    newAnswerList.push(data);
                }
                break;
        }

        setAnswerList(newAnswerList);
    };

    useEffect(() => {
        console.log("answerList: ", answerList);
    }, [answerList]);

    const calculateScore = () => {
        // Tính điểm dựa trên câu trả lời
        // Trả về điểm số
    };

    const handleNextButtonClick = () => {
        const answerCurrent = answerList.find((answer) => {
            return answer.questionId === questions[currentIndex]._id;
        });

        if (answerCurrent) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleSubmitButtonClick = () => {
        setConfirmSubmit(true); // Hiển thị xác nhận trước khi nộp bài
       
    };

    const handleConfirmSubmit = () => {
        console.log("nộp bài");
        setScore(calculateScore()); // Tính điểm và lưu vào state
        setShowResult(true); // Hiển thị kết quả khi bấm nút "Nộp bài"
        setConfirmSubmit(false); // Đặt lại state của xác nhận
        setIsTimerRunning(false); // Dừng thời gian
        // fecth đến backend gửi danh sách câu trả lời
    };

    return (
        <div className="questions-container">
            {questions.length > 0 && currentIndex < questions.length && (
                <div className="question-card">
                    <Flex justify="space-between" align="center">
                        <h6>Số câu hỏi: {currentIndex + 1}/{questions.length} - Loại: {questions[currentIndex].type}</h6>
                        <h6>Score: </h6>
                        <h6>Thời gian: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}</h6>
                    </Flex>
                    <div className="question-header">
                        <h2 className="question">{questions[currentIndex].question}</h2>
                        {/* Add question container here if needed */}
                    </div>
                    <div className="question-content">
                        {questions[currentIndex].type === "single-choice" && (
                            <SingleChoice
                                currentQuestion={questions[currentIndex]}
                                onChangeAnswer={changeAnswer}
                            />
                        )}
                        {questions[currentIndex].type === "multiple-choice" && (
                            <MultipleChoice
                                currentQuestion={questions[currentIndex]}
                                onChangeAnswer={changeAnswer}
                            />
                        )}
                        {questions[currentIndex].type === "arrange" && <span>arrange</span>}
                    </div>
                    <div className="button-container">
                        {currentIndex !== questions.length - 1 ? (
                            <Button type="primary" onClick={handleNextButtonClick}>
                                Câu tiếp theo
                            </Button>
                        ) : (
                            <Button type="primary" onClick={handleSubmitButtonClick}>
                                Nộp bài
                            </Button>
                        )}
                    </div>
                </div>
            )}
            {showResult && (
                <Result
                    status="success"
                    title="Hoàn thành thử thách!"
                    subTitle={`Điểm số của bạn là: ${score}`}
                />
            )}
            <Modal
                title="Xác nhận nộp bài"
                visible={confirmSubmit}
                onOk={handleConfirmSubmit}
                onCancel={() => setConfirmSubmit(false)}
            >
                <p>Bạn có chắc chắn muốn nộp bài không?</p>
            </Modal>
        </div>
    );
};

export default Questions; 
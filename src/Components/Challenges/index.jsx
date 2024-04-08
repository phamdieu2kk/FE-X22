import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Breadcrumb, Card, Button, Modal, Pagination, Row, Col } from "antd";
import api from "../../api";

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const location = useLocation();
  const queries = new URLSearchParams(location.search);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await api.getChallengeList.invoke({
          queries: queries,
          page: currentPage,
          pageSize: pageSize
        });
        setChallenges(response.data.challengeList);
      } catch (error) {
        console.error("Error fetching challenges:", error);
      }
    };
    fetchChallenges();
  }, [currentPage]);

  const handleShowDetail = (challenge) => {
    setSelectedChallenge(challenge);
  };

  const handleCloseDetail = () => {
    setSelectedChallenge(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="title-home">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/">Trang chủ</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Thử thách</Breadcrumb.Item>
        </Breadcrumb>
        <h2>CHỌN THỬ THÁCH</h2>
      </div>
      <Row gutter={[16, 16]}>
        {challenges.map((challenge) => (
          <Col key={challenge._id} xs={24} sm={12} md={8} lg={6} xl={6}>
            <Card
              hoverable
              cover={
                <img
                  alt="challenge"
                  src={challenge.img ?? "https://png.pngtree.com/thumb_back/fw800/background/20230903/pngtree-a-puzzle-board-with-flags-set-up-image_13191520.jpg"}
                  style={{ width: "100%"}}
                  />
              }
            >
              <Card.Meta
                title={challenge.challengeName}
                description={`Level: ${challenge.level} - Point: ${challenge.point}`}
              />
              <Button 
              style={{  marginTop: "20px" }}
              onClick={() => handleShowDetail(challenge)}>
                Thử thách
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Pagination
          total={challenges.length}
          pageSize={pageSize}
          current={currentPage}
          onChange={handlePageChange}
        />
      </div>
      <Modal
        title={selectedChallenge?.challengeName}
        visible={!!selectedChallenge}
        onCancel={handleCloseDetail}
        footer={null}
      >
        <p>Level: {selectedChallenge?.level}</p>
        <p>Point: {selectedChallenge?.point}</p>
        <Button>
          <Link to={`/questions`} style={{ color: 'inherit', textDecoration: 'none' }}>
             Chơi Ngay
          </Link>
        </Button>
      </Modal>
    </div>
  );
};

export default Challenges;
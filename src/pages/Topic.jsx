import { useEffect, useState } from "react";
import { Breadcrumb, Card, Pagination, Row, Col } from "antd";
import { Link } from "react-router-dom";
import api from "../api";

const Topic = () => {
  const [topics, setTopics] = useState({ list: [], total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const pageSize = 10; // Kích thước trang

  const fetchTopics = async () => {
    try {
      const response = await api.topic.invoke({ page: currentPage, pageSize });
      setTopics({ list: response.data.topics, total: response.data.total });
      setIsLoading(false);
    } catch (error) {
      console.error("Lỗi khi tìm chủ đề:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [currentPage]); // Fetch dữ liệu mới khi currentPage thay đổi

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="content">
        <div className="title-home">
          <Breadcrumb
            items={[
              { title: <Link to="/">Trang chủ</Link> },
              { title: "Tất cả chủ đề" },
            ]}
          />
        </div>
      </div>

      <section className="section-danhmuc">
        <Row gutter={[16, 16]}>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            topics.list.map((topic) => (
              <Col key={topic._id}xs={24} sm={12} md={8} lg={6} xl={6}>
                <Card
                  title={topic.title}
                  style={{ width:"100%" }}
                >
                  <img
                    alt="topic-img"
                    src={
                      topic.image
                        ? topic.image
                        : "https://2.bp.blogspot.com/-G3nYpK1Gnlw/VI2BDS9g38I/AAAAAAAAiKk/DTPhZEDuKPM/s1600/cau-do-dan-gian.jpg"
                    }
                    style={{ width: "100%", height: "auto" }}
                  />
                  <div className="topic-detail">
                    <h3>
                      <Link to={`/challenge?topicId=${topic._id}`}>{topic.topicName}</Link>
                      </h3>
                   
                  </div>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </section>

      {/* Hiển thị nút phân trang */}
       <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Pagination
          total={topics.total} // Tổng số mục
          pageSize={pageSize} // Kích thước trang
          current={currentPage} // Trang hiện tại
          onChange={handlePageChange} // Xử lý khi chuyển trang
        />
      </div>
    </>
  );
};

export default Topic;
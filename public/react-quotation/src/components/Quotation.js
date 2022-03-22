import { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import useLocalStorage from 'react-localstorage-hook'
import QuotationTable from "./QuotationTable";

const API_URL = process.env.REACT_APP_API_URL;

function Quotation() {

    const itemRef = useRef();
    const priceRef = useRef();
    const qtyRef = useRef();
  
    const [localDataItems, setLocalDataItems, remove] = useLocalStorage(
      "data-items",
      JSON.stringify([])
    );
  
    const [dataItems, setDataItems] = useState(JSON.parse(localDataItems));
    const [products, setProducts] = useState([]);
    const [productOptions, setProductOptions] = useState([]);
    const [price, setPrice] = useState(0);
  
    useEffect(() => {
      fetch(`${API_URL}/products`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          data.filter(v => 'code' in v) // filter out data without _id
          const z = data.map((v) => (
            <option key={v._id} value={v._id}>
              {v.name}
            </option>
          ));
          setProducts(data);
          setProductOptions(z);
        });
    }, []);
  
    const addItem = () => {
      let item = products.find((v) => itemRef.current.value === v._id);
      console.log(item);
      var itemObj = {
        id: item._id,
        code: item.code,
        name: item.name,
        price: priceRef.current.value,
        qty: qtyRef.current.value,
      };
  
      dataItems.push(itemObj);
      setDataItems([...dataItems]);
      setLocalDataItems(JSON.stringify(dataItems));
      console.log("after", dataItems);
    };
  
    const deleteProduct = () => {
      let item = products.find((v) => itemRef.current.value === v._id);
      console.log('Item to be deleted', item);
      fetch(`${API_URL}/products`,{
        method: 'DELETE',
        body: JSON.stringify({
          _id: item._id
        })
      })
      .then(res => res.json)
      .then(data => {
        console.log('Delete ', data)
      })
      .catch(err => {
        console.error(err)
      })
    }
  
    const updateDataItems = (dataItems) => {
      setDataItems([...dataItems]);
      setLocalDataItems(JSON.stringify(dataItems));
    }
  
    const clearDataItems = () => {
      setDataItems([]);
      setLocalDataItems(JSON.stringify([]));
    };
  
    const productChange = () => {
      //console.log("productChange", itemRef.current.value);
      let item = products.find((v) => itemRef.current.value === v._id);
      console.log("productChange", item);
      priceRef.current.value = item.price;
      //console.log(priceRef.current.value);
    };

    return(
        <Container>
        <Row>
          <Col md={4} style={{ backgroundColor: "#e4e4e4" }}>
            <Row>
              <Col>
                Item
                <Form.Select ref={itemRef} onChange={productChange}>
                  {productOptions}
                </Form.Select>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label>Price Per Unit</Form.Label>
                <Form.Control
                  type="number"
                  ref={priceRef}
                  value={price}
                  onChange={(e) => setPrice(priceRef.current.value)}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  ref={qtyRef}
                  defaultValue={1}
                />
              </Col>
            </Row>
            <hr />
            <div className="d-grid gap-2">
              <Button variant="primary" onClick={addItem}>
                Add
              </Button>
              <Button variant="danger" onClick={deleteProduct}>
                Delete
              </Button>
              <p />
            </div>
            {/* {JSON.stringify(dataItems)} */}
          </Col>
          <Col md={8}>
            <QuotationTable
              data={dataItems}
              clearDataItems={clearDataItems}
              updateDataItems={updateDataItems}
            />
          </Col>
        </Row>
      </Container>
    );
}

export default Quotation;
import { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";

function QuotationTable({ data, clearDataItems, updateDataItems }) {

  const API_URL = process.env.REACT_APP_API_URL;

  // const [dataItems, setDataItems] = useState(data);
  const [dataRows, setDataRows] = useState();
  const [total, setTotal] = useState(0);

  const style = {
    textCenter: {textAlign: 'center'},
    textRight: {textAlign: 'right'}
  }

  useEffect(() => {
    let sum = 0;
    const z = data.map((v, i) => {
      let amount = v.qty * v.price;
      sum += amount;
      return (
        <tr key={i}>
          <td className={style.textCenter}>
            <FaTrashAlt onClick={() => deleteItem(v.code)} />
          </td>
          <td className={style.textCenter}>{v.qty}</td>
          <td>{v.name}</td>
          <td className={style.textCenter}>{formatNumber(v.price)}</td>
          <td className={style.textRight}>{formatNumber(amount)}</td>
        </tr>
      );
    });

    setDataRows(z);
    setTotal(sum);
  }, [data]);

  const deleteItem = (code) => {
    var z = data.filter((value, index, arr) => value.code !== code);
    updateDataItems(z);
  };

  const clearTable = () => {
    clearDataItems();
    setDataRows([]);
  };

  const formatNumber = (x) => {
    x = Number.parseFloat(x)
    return x.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const saveTable = () => {
    var today = new Date();
    const newQuotation = {
      table: data,
      date: today
    };
    fetch(`${API_URL}/quotations`, {
      method: "POST", 
      mode: "cors", 
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(newQuotation),
    })
    .then(res => res.json())
    .then(json => {
      // Successfully added the quotation table
      console.log("Quotation POST Result", json)
    });
  }

  return (
    <div>
      <h1>Quotation</h1>
      <Button onClick={clearTable} variant="outline-dark">
        Clear
      </Button>
      &nbsp;&nbsp;&nbsp;
      <Button onClick={saveTable} variant="outline-success">
        Save
      </Button> 
      <Table striped bordered hover>
        <thead>
          <tr>
            <th style={{ width: "20px" }}>&nbsp;</th>
            <th className={style.textCenter}>Qty</th>
            <th className={style.textCenter}>Item</th>
            <th className={style.textCenter}>Price/Unit</th>
            <th className={style.textCenter}>Amount</th>
          </tr>
        </thead>
        <tbody>{dataRows}</tbody>
        <tfoot>
          <tr>
            <td colSpan={4} className={style.textRight}>
              Total
            </td>
            <td className={style.textRight}>
              {formatNumber(total)}
            </td>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
}

export default QuotationTable;

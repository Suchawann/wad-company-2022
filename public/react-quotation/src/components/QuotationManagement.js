import React from 'react';
import { useState, useEffect, useRef } from "react";
import { Container, Table, Button, Modal, Row, Col, Form } from "react-bootstrap";
import style from "../mystyle.module.css";
import { FaTrashAlt, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

function QuotationManagement() {
  
  const API_URL = process.env.REACT_APP_API_URL;

  const [quotations, setQuotations] = useState([]);
  const [quotationRows, setQuotationRows] = useState([]);
  const [show, setShow] = useState(false); // For Modal Forms
  const [totalAmount, setTotalAmount] = useState(0);

  const styles = {
    textCenter: {textAlign: 'center'},
    textRight: {textAlign: 'right'},
    textLeft: {textAlign: 'left'}
  }
  
  useEffect(() => {
    fetch(`${API_URL}/quotations`)
      .then((res) => res.json())
      .then((data) => {
        var total_amount = 0
        data.sort((a,b) => new Date(b.date) < new Date(a.date) ? 1 : -1);
        const rows = data.map((e, i) => {
          //console.log(data)
          var myKey = 0
          const allQuots = []
          var curr_date = e.date.slice(0, 10)
          e.table.forEach((q, j) => { // Loop through each table
            //console.log(q)
            var curr_amount = q.price * q.qty
            total_amount = total_amount + curr_amount
            //allQuots.push([q.code, q.name, q.price, q.qty, curr_amount, curr_date])
            allQuots.push(
              <tr key={myKey}>
                <td>
                  <FaTrashAlt onClick={() => {handleDelete(e)}} />
                </td>
                <td>{q.code}</td>
                <td>{q.name}</td>
                <td>{q.price}</td>
                <td>{q.qty}</td>
                <td>{curr_amount}</td>
                <td>{curr_date}</td>
              </tr>
            )
            myKey++
          })
          //console.log(allQuots)
          return (
            allQuots
          )
        })

        setTotalAmount(total_amount);
        setQuotations(data);
        setQuotationRows(rows);
      });
  }, []);

  // Close modal form
  const handleClose = () => {
    setShow(false);
  };

  const handleDelete = (quotation) => {
    var quo_names = ""
    quotation.table.forEach((e, i) => {
      quo_names = quo_names.concat(e.name, " ")
    })
    console.log("Deleting", quo_names);
    if (window.confirm(`Are you sure to delete [${quo_names}]?`)) {
      fetch(`${API_URL}/quotations/${quotation._id}`, {
        method: "DELETE",
        mode: "cors",
      })
      .then(res => res.json())
      .then(json => {
        // Successfully deleted
        console.log("DELETE Result", json)
        for (let i = 0; i < quotations.length; i++) {
          if (quotations[i]._id === quotation._id) {
            quotations.splice(i,1);
            break;
          }
        }
        // Re-render
        var total_amount = 0
        quotations.sort((a,b) => new Date(b.date) < new Date(a.date) ? 1 : -1);
        const rows = quotations.map((e, i) => {
          var myKey = 0
          const allQuots = []
          var curr_date = e.date.slice(0, 10)
          e.table.forEach((q, j) => {
            var curr_amount = q.price * q.qty
            total_amount = total_amount + curr_amount
            allQuots.push(
              <tr key={myKey}>
                <td>
                  <FaTrashAlt onClick={() => {handleDelete(e)}} />
                </td>
                <td>{q.code}</td>
                <td>{q.name}</td>
                <td>{q.price}</td>
                <td>{q.qty}</td>
                <td>{curr_amount}</td>
                <td>{curr_date}</td>
              </tr>
            )
            myKey++
          })
          return (
            allQuots
          );
        });

        setTotalAmount(total_amount);
        setQuotations(quotations);
        setQuotationRows(rows);
        handleClose()
      });
    }
  };

  const formatNumber = (x) => {
    x = Number.parseFloat(x)
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return(
    <>

    <Container>

      <h1>Quotation Management</h1>

      {/* <Button variant="outline-dark" onClick={handleShowAdd}><FaPlus/> Add</Button> */}
      <Link to={'/quotation'}>
        <Button variant="outline-dark"><FaPlus/> Add</Button>
      </Link>

        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th style={{ width: "60px" }}>&nbsp;</th>
              <th className={style.textCenter}>Code</th>
              <th className={style.textCenter}>Name</th>
              <th className={style.textCenter}>Price/Unit</th>
              <th className={style.textCenter}>Quantity</th>
              <th className={style.textCenter}>Amount</th>
              <th className={style.textCenter}>Date</th>
            </tr>
          </thead>
          <tbody>
            {quotationRows}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan={5}></th>
              <th style={styles.textRight}>Total Amount</th>
              <th style={styles.textRight}>{formatNumber(totalAmount)}</th>
            </tr>
          </tfoot>
        </Table>

    </Container>

    </>
  );
}

export default QuotationManagement;
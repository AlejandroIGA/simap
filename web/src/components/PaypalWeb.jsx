import React from "react";
import ReactDOM from "react-dom"
import Menu from "./Menu";
import conf from '../conf';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from "react";

function PaypalWeb() {
  const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });
  const navigate = useNavigate();

  const suscribirse = async () =>{
    try{
        const id_usuario = sessionStorage.getItem('id_usuario');
        const formData = new FormData();
        formData.append("id_usuario", id_usuario);
        const response = await fetch(conf.url + "/suscribirse/", {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        console.log(data.mensaje);
        alert(data.mensaje);
    }catch(error){
        console.error("ERROR PAYPAL: ", error.message);
    }
}


  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: "285",
          },
        },
      ],
    });
  };

  const logout = async()=>{
    const id_usuario = sessionStorage.getItem('id_usuario');
    const formData = new FormData();
    formData.append("id_usuario", id_usuario);
    try {
      const response = await fetch(conf.url + '/logout', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        sessionStorage.clear()
        console.log("Sesión terminada, id_usuario: " + id_usuario)
        navigate("/login");
      } else {
        console.error('Error al cerrar sesión:', response.statusText);
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }

  async function onApprove(data, actions) {
    let order = await actions.order.capture();
    console.log("onApprove: ",order);
    suscribirse();
    setTimeout(() => {
      logout(); 
    }, 1000);
    return order;
  }

  function onError(err) {
    console.log("onError: ",err);
    alert("Error: ",err);
    let errObj = {
      err: err,
      status: "FAILED",
    };
    return JSON.stringify(errObj);
  }

  useEffect(()=>{
  },[])

  return (
    <div className="container-fluid p-0 m-0" style={{ background: '#f2f2f2', height: '100vh' }}>
      <Menu />
      <div className='container p-0 pb-5 px-3 mt-5'>
        <div className="card mb-3" style={{ border: "3px solid #658C7A", borderRadius: 10, background: '#f2f2f2', }}>
          <h3 className="card-header text-center" style={{ borderBottom: "3px solid #658C7A" }}>Suscripción Pro</h3>
          <div className="card-body" style={{ borderBottomLeftRadius: 10, borderBottomRightRadius: 10, fontSize: 25 }}>
            <div class="row row-cols-1  g-4 pb-3" >
              <div class="col">
                <div class="card h-100" style={{ border: "none", background: '#f2f2f2', }}>
                  <div class="card-body">
                    <ul class="list-group list-group-flush" >
                      <li class="list-group-item" style={{ background: '#f2f2f2', border: "none" }}>- 3 administradores</li>
                      <li class="list-group-item" style={{ background: '#f2f2f2', border: "none" }}>- 10 colaboradores</li>
                      <li class="list-group-item" style={{ background: '#f2f2f2', border: "none" }}>- 5 dispositivos maestro</li>
                      <li class="list-group-item" style={{ background: '#f2f2f2', border: "none" }}>- 30 dispositivos esclavo</li>
                    </ul>
                    <div className="row w-100">
                    <div className="col">
                            <button hidden></button>
                        </div>
                      <div className="col">
                      <PayPalButton
                      createOrder={(data, actions) => createOrder(data, actions)}
                      onApprove={(data, actions) => onApprove(data, actions)}
                      onCancel={() => onError("Canceled")}
                      onError={(err) => onError("ERROR")}
                      style={{
                        shape: 'pill',
                        label: 'pay',
                        height: 40,
                        layout: 'horizontal',
                      }}
                    />
                      </div>
                      <div className="col">
                            <button hidden></button>
                        </div>
                    </div>
                    
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default PaypalWeb;

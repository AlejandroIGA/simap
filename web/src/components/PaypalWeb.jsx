import React from "react";
import ReactDOM from "react-dom"
import Menu from "./Menu";

function PaypalWeb() {
  const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });

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

  async function onApprove(data, actions) {
    let order = await actions.order.capture();
    console.log(order);
    return order;
  }

  function onError(err) {
    console.log(err);
    let errObj = {
      err: err,
      status: "FAILED",
    };
    return JSON.stringify(errObj);
  }

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
                      <li class="list-group-item" style={{ background: '#f2f2f2', border: "none" }}>- Lectura cada dos minutos</li>
                      <li class="list-group-item" style={{ background: '#f2f2f2', border: "none" }}>- Gráficas avanzadas</li>
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

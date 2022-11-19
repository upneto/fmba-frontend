import React from 'react';
import ReactPaginate from 'react-paginate';
import AsyncSelect  from 'react-select/async';
import { Navigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2"; 
import moment from 'moment';
//bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './OrdersHome.css';
import '../../App.css';
import OrderService from '../../services/OrderService';
import ClienteService from '../../services/ClienteService';
import VeiculoService from '../../services/VeiculoService';

class OrdersHome extends React.Component {
  constructor(props) {
    super(props)
      this.state = {
        data: [],
        showAdd: false,
        orderId: 0,
        operacaoId: 0,
        offset: 0,
        perPage: 10,
        currentPage: 0,
        veiculoId: 0,
        clienteId: 0,
        dataCriacao: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        dataInicio: null,
        dataFinal: null,
        placa: 'Selecione um veiculo.',
        status: 1
      }
  }

  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;

    this.setState({
        currentPage: selectedPage,
        offset: offset
    }, () => {
        this.receivedData()
    });

  };

  confirmDelete(orderId) {  

    const token = localStorage.getItem('token');
    Swal.fire({  
      title: 'Você tem certeza?',  
      text: 'Esta ordem de serviço #'+ orderId + ' será excluída e não poderá ser recuperada.',  
      icon: 'warning',  
      showCancelButton: true,  
      confirmButtonColor: '#3085d6',  
      cancelButtonColor: '#d33',  
      confirmButtonText: 'Sim!',
      cancelButtonText: 'Cancelar'  
    }).then( (res) => {

      if(res.isConfirmed)

        OrderService.deleteOrder(token, orderId).then( (resDel) => {
          if( resDel.status === 200)
          {
            Swal.fire({  
              title: 'Sucesso!',  
              icon: 'success',  
              text: 'Ordem de Serviço excluída com sucesso!',  
            }).then(() => window.location.reload());
          }
          else
            Swal.fire({  
              icon: 'warning',  
              title: 'Aviso!',  
              text: 'Esta Ordem não foi excluída!'
            });

        }).catch( (err) => {
      
          Swal.fire({  
            icon: 'error',  
            title: 'Oops...',  
            text: 'Algo deu errado!',
            footer: err  
          });

      });

    }); 
    
    return;
  }

  async mountSelectClientes(){
    
    const mapResponseToValuesAndLabels = (data) => ({
      value: data.id,
      label: data.nome 
    });

    return await ClienteService.getClientes().then( (res)=>res.data.map(mapResponseToValuesAndLabels)).catch((err) => {
      Swal.fire({  
        icon: 'error',  
        title: 'Oops...',  
        text: 'Algo deu errado!',
        footer: err 

      });
    });

  }

  async mountSelectVeiculos(){

    const mapResponseToValuesAndLabels = (data) => ({
      value: data.id,
      label: data.marca + ' ' + data.modelo, 
      placa: data.placa
    });
    
    return await VeiculoService.getVeiculos().then((res)=>res.data.map(mapResponseToValuesAndLabels)).catch((err) => {
      Swal.fire({  
        icon: 'error',  
        title: 'Oops...',  
        text: 'Algo deu errado!',
        footer: err 

      });
    });
   
  }

  clear(){
    this.setState({orderId: 0});
    this.setState({veiculoId: 0});
    this.setState({clienteId: 0});
    this.setState({dataCriacao: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')});
    this.setState({dataInicio: null});
    this.setState({dataFinal: null});
    this.setState({placa: 'Selecione um veiculo.'});
  }

  loadOrder(orderId){

    const token = localStorage.getItem('token');
    OrderService.getOrderById(token, orderId).then( (res) => {

      if( res.status === 200)
      {
        var data = res.data.dataInicio.split('/');
        document.getElementById('dataini').value = data[2] + '-' + data[1] + '-' + data[0];
        this.setState({dataInicio: data[2] + '-' + data[1] + '-' + data[0] + ' 00:00:00'});
        data = res.data.dataFinal.split('/');
        document.getElementById('datafim').value = data[2] + '-' + data[1] + '-' + data[0];
        this.setState({dataFinal: data[2] + '-' + data[1] + '-' + data[0] + ' 00:00:00'});
        this.setState({veiculoId: res.data.idVeiculo});
        this.setState({veiculo: res.data.veiculo});
        this.setState({clienteId: res.data.idCliente});
        this.setState({cliente: res.data.nomeCliente});
        this.setState({placa: res.data.placa});
      }
      else
        Swal.fire({  
          icon: 'warning',  
          title: 'Aviso!',  
          text: 'Esta Ordem não foi localizada!'
        });

    }).catch( (err) => {
        
      Swal.fire({  
        icon: 'error',  
        title: 'Oops...',  
        text: 'Algo deu errado!',
        footer: err 

      });
    });

  }

  confirmSave(){

    if( this.confirmData() )
    {

      const token = localStorage.getItem('token');
      const order = {
          id: this.state.orderId,
          cliente: this.state.clienteId,
          veiculo: this.state.veiculoId,
          dataCriacao: this.state.dataCriacao,
          dataInicio: this.state.dataInicio,
          dataFinal: this.state.dataFinal,
          status: 1
       }

      if( this.state.orderId === 0 )
      {

        OrderService.saveOrder(token, order).then( (res) => {

          if( res.status === 200)
            Swal.fire({  
              title: 'Sucesso!',  
              icon: 'success',  
              text: 'Ordem de Serviço gerada com sucesso!',  
            }).then(() => window.location.reload());
          else
            Swal.fire({  
              icon: 'warning',  
              title: 'Aviso!',  
              text: 'Esta Ordem não foi gerada!'
            }).then(() => this.setState({showAdd: false}));

        }).catch( (err) => {
        
          Swal.fire({  
            icon: 'error',  
            title: 'Oops...',  
            text: 'Algo deu errado!',
            footer: err  
          });

        });
      }
      else{

        OrderService.updateOrder(token, this.state.orderId, order).then( (res) => {

          if( res.status === 200)
            Swal.fire({  
              title: 'Sucesso!',  
              icon: 'success',  
              text: 'Ordem de Serviço atualizada com sucesso!',  
            }).then(() => window.location.reload());
          else
            Swal.fire({  
              icon: 'warning',  
              title: 'Aviso!',  
              text: 'Esta Ordem não foi atualizada!'
            }).then(() => this.setState({showAdd: false}));  

        }).catch( (err) => {
        
          Swal.fire({  
            icon: 'error',  
            title: 'Oops...',  
            text: 'Algo deu errado!',
            footer: err  
          });

        });

      }
    }      
  }

  componentDidMount() {

    OrderService.getOrders(localStorage.getItem('token'))
    .then((res) => {
      if(res.status === 200)
      {
        this.setState({ data: res.data});
        this.receivedData();
      }
    }).catch((err) => {

      Swal.fire({  
          icon: 'error',  
          title: 'Oops...',  
          text: 'Algo deu errado!',
          footer: err  
        });

    });

  }

  receivedData() {

    const slice = this.state.data.slice(this.state.offset, this.state.offset + this.state.perPage)
    const postData = slice.map((result, index ) => <React.Fragment key={index}>
                <tr>
                  <td>{result.codigo}</td>
                  <td>{result.dataInicio}</td>
                  <td>{result.dataFinal}</td>
                  <td>{result.nomeCliente}</td>
                  <td>{result.veiculo}</td>
                  <td>{result.placa}</td>
                  <td>
                    <button className="bg-info"> <i className="fa fa-eye" onClick={() => { this.setState({operacaoId: 0}); this.setState({orderId: result.codigo}); this.setState({showAdd: true}); this.loadOrder(result.codigo) }}></i> </button>
                    <button className="bg-warning"> <i className="fa fa-edit" onClick={() => { this.setState({operacaoId: 1}); this.setState({orderId: result.codigo}); this.setState({showAdd: true}); this.loadOrder(result.codigo) }}></i> </button>
                    <button className="bg-danger" onClick={() => {this.confirmDelete(result.codigo)}}> <i className="fa fa-trash"></i> </button>
                  </td>
                </tr>  
      </React.Fragment>)

    this.setState({
      pageCount: Math.ceil(this.state.data.length / this.state.perPage),
      postData
    })

  }

  confirmData(){
    var erro = '';

    if( this.state.clienteId === 0 )
      erro += 'Selecione um cliente!';

    if( this.state.veiculoId === 0 )
    {
      if( erro !== '')
        erro += '<br/>';
      erro += 'Selecione um veiculo!';
    }

    if( this.state.dataInicio === null || this.state.dataInicio === "" || 
        this.state.dataFinal === null || this.state.dataFinal === "" || 
        this.state.dataFinal < this.state.dataInicio )  
    {
      if( erro !== '')
        erro += '<br/>';
      erro += 'Data Inválida! e/ou Data Final menor que a Data Inicial!';
    }
      
    if(erro !== '' )
    {
      Swal.fire({  
        icon: 'warning',  
        title: 'Aviso!',  
        html: erro
      });
      return false;
    }
    
    return true;
  }

  render() {

    if (!localStorage.getItem("authenticated"))
      return <Navigate replace to="/login" />;

    return (

      <div className="maincontainer">
        <h5 className="mr-5 m-5 mt-5 text-center">Módulo de Ordem de Serviço</h5>
        <div className="container mb-5 mt-5 text-right">
          <button className="bg-primary mb-3" onClick={() => { this.clear(); this.setState({showAdd: true});} }>
            <i className="fa fa-plus"></i><span className='text-white'>&nbsp;Novo</span>
          </button>
          <table className="table table-hover table-bordered">
            <thead>
              <tr>
                <th>Número</th>
                <th>Iniciado</th>
                <th>Finalizado</th>
                <th>Cliente</th>
                <th>Veículo</th>
                <th>Placa</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
            {this.state.postData}
            </tbody>
          </table>
          <ReactPaginate
                    previousLabel={"Anterior"}
                    nextLabel={"Próxima"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={this.state.pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={this.handlePageClick}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}/>
        </div>
        <Modal show={this.state.showAdd}>
          <Modal.Header closeButton onClick={() => {
            this.setState({showAdd: false});
          }}>
            <Modal.Title>{this.state.orderId === 0 ?  'Inclusão' : ( this.state.operacaoId === 0 ? '' : 'Alteração')} Ordem de Serviço {this.state.orderId === 0 ? '' : '#' + this.state.orderId}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="container mb-5 mt-5 text-right">
              <Form.Group className="mb-5 mt-5 text-right">
                <Form.Label className="label">Veículo</Form.Label>
                <AsyncSelect cacheOptions defaultOptions value={this.state.orderId > 0 ? {value: this.state.veiculoId, label: this.state.veiculo} : undefined}
                loadOptions={this.mountSelectVeiculos} onChange={ (data) => { this.setState({ veiculoId: data.value }); this.setState({ placa: data.placa }); }} isDisabled={this.state.operacaoId === 0 && this.state.orderId > 0}/>
                <Form.Label className="label">Placa</Form.Label>
                <Form.Control className="name-input" type="text" value={this.state.placa} disabled></Form.Control>
                <Form.Label className="label">Nome do Cliente</Form.Label>
                <AsyncSelect cacheOptions defaultOptions value={this.state.orderId > 0 ? {value: this.state.clienteId, label: this.state.cliente} : undefined}
                loadOptions={this.mountSelectClientes} onChange={ (data) => { this.setState({ clienteId: data.value }); }} isDisabled={this.state.operacaoId === 0 && this.state.orderId > 0} />
                <Form.Label className="label">Data Início</Form.Label>
                <Form.Control className="data-input" type="date" id="dataini" onChange={ () => { this.setState({ dataInicio: document.getElementById('dataini').value + ' 00:00:00' }); }} disabled={this.state.operacaoId === 0 && this.state.orderId > 0}></Form.Control>
                <Form.Label className="label">Data Final</Form.Label>
                <Form.Control className="data-input" type="date" id="datafim" onChange={ () => { this.setState({ dataFinal: document.getElementById('datafim').value + ' 00:00:00' }); }} disabled={this.state.operacaoId === 0 && this.state.orderId > 0}></Form.Control>
              </Form.Group>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="bg-success" hidden={this.state.operacaoId === 0 && this.state.orderId > 0} onClick={() => {
              this.confirmSave();
            }}>Salvar</Button>
            <Button className="bg-danger" onClick={() => {
              this.setState({showAdd: false});
            }}>Cancelar</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  };
}

export default OrdersHome;
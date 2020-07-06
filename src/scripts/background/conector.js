import browser from 'webextension-polyfill';

class ControlEvent extends CustomEvent {
  constructor(name, detail) {
    super(name, {
      detail: {
        message: detail,
        time: new Date(),
      },
      bubbles: true,
      cancelable: true,
    });

    this.nameEvent = name;
    this.detailMessage = detail;
    this.inicio = new Date();
    this.customTarget = null;
    this.finishEvent = false;
    this.finishTime = null;
    this.data = null;
  }

  setData(data) {
    this.data = data;
  }

  getData() {
    return this.data;
  }

  getEvent() {
    return this.event;
  }

  getName() {
    return this.nameEvent;
  }

  assignEvent(objeto, callback) {
    try {
      objeto.addEventListener(this.nameEvent, callback, false);
    } catch (error) {
      console.log(error);
      console.log('Error al asignar objeto');
    }
  }

  removeEvent(objeto, callback) {
    try {
      objeto.removeEventListener(this.nameEvent, callback, true);
    } catch (error) {
      console.log('Error al remover objeto');
    }
  }
}

class ConectorP2P {
  constructor() {
    try {
      this.extensionParent = '';
      this.port = null;
      this.extensionName = '';
      this.messageRequest = [];
      this.messageResponse = [];
      this.peername = '';
      this.extensionId = '';
      this.resultQuery = null;
      this.signal = false;
      this.msjData = null;
      this.controlMessage = new ControlEvent('controlMessage', 'onmessage');
      this.elementDom = document.createElement('BUTTON');
      this.listenEventMSG = document.createElement('BUTTON');
      this.customExtension = null;
    } catch (e) {
      // statements
      console.log('Error al instanciar un conectorP2P ', e);
    }
  }

  setExtension(objeto) {
    this.customExtension = objeto;
  }

  getExtension() {
    return this.customExtension;
  }

  getResultQuery() {
    return this.resultQuery;
  }

  getData() {
    return this.msjData;
  }

  getNamePeer() {
    return this.peername;
  }

  connect() {
    try {
      this.port = browser.runtime.connect(this.getParentConector());
    } catch (e) {
      console.log('Error al realizar conector');
      console.log(e);
    }
  }

  getData() {
    return this.msjData;
  }

  sendEvent(data) {
    console.log('Evento signal');
    //console.log(data);
    if (this.signal) {
      this.msjData = data;
      let check_msg = JSON.parse(data);
      if (check_msg.type == 'responseQuery') {
        this.listenEventMSG.dispatchEvent(this.controlMessage);
      } else {
        this.elementDom.dispatchEvent(this.controlMessage);
      }
    }
  }

  /*
	queryResult(event){
		console.log("Llamada a evento: ",event);
		//la funcion de instancia esta fuera del scope de la funcion de evento
		let dato = this.extractDataCallback();
		this.callback(dato);
	}
	*/

  getConnect() {
    try {
      return this.port;
    } catch (e) {
      console.log('Error al realizar retornar puerto de conexion');
      console.log(e);
    }
  }

  setName(name) {
    this.extensionName = name;
  }
  getName() {
    return this.extensionName;
  }

  setParentConector(name) {
    try {
      this.extensionParent = name;
    } catch (e) {
      console.log(e);
    }
  }

  getParentConector() {
    return this.extensionParent;
  }

  sendData(obj) {
    try {
      this.port.postMessage(JSON.stringify(obj));
    } catch (e) {
      console.log('Error al enviar datos desde la extension');
      console.log(e);
    }
  }

  sendQuery(query, callback) {
    try {
      /*
				if (!this.port.onMessage.hasListener(callback)){
					this.port.onMessage.addListener(callback);
				}
				*/

      try {
        if (query.method) {
          this.controlMessage.removeEvent(this.listenEventMSG, callback);
          this.controlMessage.assignEvent(this.listenEventMSG, callback);
        } else {
          this.controlMessage.removeEvent(this.elementDom, callback);
          this.controlMessage.assignEvent(this.elementDom, callback);
        }
      } catch (error) {
        console.log('No existe evento aun');
      }

      this.signal = true;
      this.getQuery(query);
    } catch (e) {
      console.log('Error al enviar consulta remota');
      console.log(e);
    }
  }

  getExtensionId() {
    return this.extensionId;
  }

  setNameExtensionId(name) {
    this.extensionId = name;
  }

  getQuery(query) {
    try {
      let jsonQuery = query;
      //let resultado=null;
      let data = null;
      if (jsonQuery.data) {
        data = jsonQuery.data;
      }

      let peerslist = {
        type: 'queryExtension',
        method: jsonQuery.method,
        data: data,
        extensioname: this.getName(),
        extensionId: this.getExtensionId(),
      };

      this.sendData(peerslist);
    } catch (e) {
      console.log('Error al realizar pedido de peers remotos.');
      console.log(e);
    }
  }

  getDataResponseQuery(msj) {
    try {
      console.log('Desde getDataResponseQuery conector Query: ${msj}');
      let msj_data = JSON.parse(msj);
      //console.log(msj_data);
      switch (msj_data.type) {
        case 'responseQuery':
          switch (msj_data.method) {
            case 'getPeers':
              //console.log(msj_data.data.peers);
              this.resultQuery = msj_data.data.peers;
              break;
            case 'getSession':
              //console.log(msj_data.data.peers);
              this.resultQuery = msj_data.data;
              break;
          }
          break;
      }
    } catch (e) {
      console.log('Error al realizar parser de query');
      console.log(e);
    }
  }

  removeListenerQuery(callback) {
    try {
      if (this.port.onMessage.hasListener(callback)) {
        this.port.onMessage.removeListener(callback);
      } else {
        console.log('No existe una listener a remover.');
      }
    } catch (e) {
      console.log('Remove listener query');
      console.log(e);
    }
  }

  getRequestMessage() {
    try {
      let obj = {
        type: 'messagesRequest',
        extensioname: this.getName(),
      };
      this.sendData(obj);
    } catch (e) {
      console.log('Error al solicitar mensajes response de la extension.');
      console.log(e);
    }
  }

  getResponseMessage() {
    try {
      let obj = {
        type: 'messagesResponse',
        extensioname: this.getName(),
      };
      this.sendData(obj);
    } catch (e) {
      console.log('Error al solicitar mensajes request de la extension.');
      console.log(e);
    }
  }

  extractDataCallback() {
    try {
      let dato = null;
      //obtiene la lista de la querry al plugin principal p2p
      this.getDataResponseQuery(this.getData());
      //con la respuesta async obtenemos el resultado correspondiente ya parseado
      if (this.getResultQuery() != null || this.getResultQuery() != 'undefined') {
        dato = this.getResultQuery();
      } else {
        console.log('No hay datos disponibles');
        return null;
      }

      console.log('Info desde extract_data: ', dato);

      return dato;
    } catch (error) {
      console.log('Error al realizar extrac: ', error);
    }
  }

  instalarExtension() {
    try {
      let install = {
        type: 'addExtension',
        name: this.getName(),
      };
      this.sendData(install);
    } catch (e) {
      console.log('Error al instalar la extension');
      console.log(e);
    }
  }

  sendDataType(name, id, data, peer, type) {
    try {
      let objquery = {
        extensioname: name,
        type: type,
        data: data,
        id: id,
        destiny: peer,
      };

      this.sendData(objquery);
    } catch (error) {
      console.log('Error al realizar send request');
    }
  }
}

export class AbstractP2PExtensionBackground {
  constructor() {
    this.portEvent = null;
    this.conector = null;
    //patch callback handler;
    this.callback = null;
  }

  connect() {
    console.log('Me conecto');
    this.conector = new ConectorP2P();
    this.conector.setExtension(this);
    this.conector.setParentConector('device1@oncosmos.com');
    this.conector.setName(this.getExtensionName());
    this.conector.setNameExtensionId(this.getExtensionId());
    this.conector.connect();
    this.portEvent = this.conector.getConnect();

    //this.initialize();

    this.portEvent.onMessage.addListener((msj) => {
      let msj_data = JSON.parse(msj);
      this.conector.sendEvent(msj);
      switch (msj_data.type) {
        case 'Message':
          console.log('Arriva mensaje');
          break;
        case 'Request':
          console.log('request sin accept');
          browser.notifications.create({
            type: 'basic',
            iconUrl: browser.extension.getURL('icons/quicknote-48.png'),
            title: 'Llega un request del Peer remoto: ' + msj_data.source,
            message: 'Para aceptar el request tiene que aceptar el mensaje',
          });
          break;
        case 'AcceptRequest':
          try {
            console.log('Es un request');
            console.log(msj_data.data);
            let msjRemote = msj_data.data;
            if (msjRemote.data.automatic) {
              this.automaticProcessing(msjRemote.data, msjRemote.source);
            } else {
              this.processRequest(msjRemote.data, msjRemote.source);
            }
          } catch (error) {
            console.log('Error al procesar requestAccept: ', error);
          }

          break;
        case 'Response':
          console.log('response sin accept');
          browser.notifications.create({
            type: 'basic',
            iconUrl: browser.extension.getURL('icons/quicknote-48.png'),
            title: 'Llega un response del Peer remoto: ' + msj_data.source,
            message: 'Para aceptar el response tiene que aceptar el mensaje',
          });
          break;
        case 'AcceptResponse':
          console.log('Es un response');
          let msjResponse = msj_data.data;
          this.processResponse(msjResponse.data, msjResponse.source);
          break;
      }
    });
    this.conector.instalarExtension();
  }

  initialize() {
    console.log('Algo para inicio');
  }

  getPeers(callback) {
    console.log('Getting peers');
    try {
      this.conector.sendQuery({ method: 'getPeers', data: {} }, callback);
    } catch (error) {
      console.log('Error al realizar peticion de peers: ', error);
    }
  }

  sendResponse(msg, peer) {
    console.log('Send response');
    this.conector.sendDataType(
      this.getExtensionName(),
      this.getExtensionId(),
      msg,
      peer,
      'Response'
    );
  }

  sendRequest(msg, peer) {
    this.conector.sendDataType(
      this.getExtensionName(),
      this.getExtensionId(),
      msg,
      peer,
      'Request'
    );
    console.log('Sent Request');
  }

  sendLocalRequest(job) {
    scrapping(job);
  }

  getDataCallBack() {
    return this.conector.extractDataCallback();
  }
}

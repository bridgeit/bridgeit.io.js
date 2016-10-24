if( ! ('bridgeit' in window)){
	throw new Error('bridgeit-services.js requires bridgeit.js, please include bridgeit.js before bridgeit-services.js');
}

(function(b) {

	"use strict";

	function fireEvent(el, eventName, detail){
		var event;
		if( 'CustomEvent' in window ){
			event = new CustomEvent(eventName, { 'detail': detail });
		}
		else if(document.createEvent){//IE 10 & other older browsers
			event = document.createEvent('HTMLEvents');
			event.initEvent(eventName, true, true);
		}
		else if(document.createEventObject){// IE < 9
			event = document.createEventObject();
			event.eventType = eventName;
		}
		event.eventName = eventName;
		if(el.dispatchEvent){
			el.dispatchEvent(event);
		}else if(el.fireEvent && htmlEvents['on'+eventName]){// IE < 9
			el.fireEvent('on'+event.eventType, event);// can trigger only real event (e.g. 'click')
		}else if(el[eventName]){
			el[eventName]();
		}else if(el['on'+eventName]){
			el['on'+eventName]();
		}
	}

	/************************* Private ********************/

	/* Action */
	function validateRequiredAction(params, reject){
		validateParameter('action', 'The action parameter is required', params, reject);
	}

	/* Admin */
	function validateRequiredUser(params, reject){
		validateParameter('user', 'The user parameter is required', params, reject);
	}

	function validateRequiredRealm(params, reject){
		validateParameter('realm', 'The realm parameter is required', params, reject);	
	}

	function validateRequiredRole(params, reject){
		validateParameter('role', 'The role parameter is required', params, reject);	
	}

	/* Auth */
	function validateRequiredRealm(params, reject){
		validateParameter('realm', 'The BridgeIt realm is required', params, reject);
	}

	function validateRequiredPassword(params, reject){
		validateParameter('password', 'The password parameter is required', params, reject);
	}

	function validateRequiredPermissions(params, reject){
		validateParameter('permissions', 'The permissions parameter is required', params, reject);
	}

	function validateAndReturnRequiredAccessToken(params, reject){
		var token = params.accessToken || services.auth.getLastAccessToken();
		if( token ){
			return token;
		}
		else{
			return reject(Error('A BridgeIt access token is required'));
		}
	}

	function validateAndReturnRequiredRealmName(params, reject){
		var realm = params.realmName;
		if( realm ){
			realm = encodeURI(realm);
		}
		else{
			realm = services.auth.getLastKnownRealm();
		}
		if( realm ){
			b.setSessionStorageItem(btoa(REALM_KEY), btoa(realm));
			return realm;
		}
		else{
			return reject(Error('The BridgeIt realm is required'));
		}
	}

	function validateAndReturnRequiredRealm(params, reject){
		var realm = params.realm;
		if( realm ){
			realm = encodeURI(realm);
		}
		else{
			realm = services.auth.getLastKnownRealm();
		}
		if( realm ){
			b.setSessionStorageItem(btoa(REALM_KEY), btoa(realm));
			return realm;
		}
		else{
			return reject(Error('The BridgeIt realm is required'));
		}
	}

	function validateAndReturnRequiredAccount(params, reject){
		var account = params.account;
		if( account ){
			account = encodeURI(account);
		}
		else{
			account = services.auth.getLastKnownAccount();
		}
		if( account ){
			b.setSessionStorageItem(btoa(ACCOUNT_KEY), btoa(account));
			return account;
		}
		else{
			return reject(Error('The BridgeIt account is required'));
		}
	}

	function validateAndReturnRequiredUsername(params, reject){
		var username = params.username;
		if( !username ){
			username = services.auth.getLastKnownUsername();
		}
		if( username ){
			b.setSessionStorageItem(btoa(USERNAME_KEY), btoa(username));
			return username;
		}
		else{
			return reject(Error('The BridgeIt username is required'));
		}
	}

	function validateRequiredUsername(params, reject){
		validateParameter('username', 'The username parameter is required', params, reject);
	}

	/* EventHub */
	function validateRequiredHandler(params, reject){
		validateParameter('handler', 'The handler parameter is required', params, reject);
	}
	function validateRequiredRecognizer(params, reject){
		validateParameter('handler', 'The recognizer parameter is required', params, reject);
	}

	/* Locate */
	function validateRequiredRegion(params, reject){
		validateParameter('region', 'The region parameter is required', params, reject);
	}

	function validateRequiredMonitor(params, reject){
		validateParameter('monitor', 'The monitor parameter is required', params, reject);
	}

	function validateRequiredPOI(params, reject){
		validateParameter('poi', 'The poi parameter is required', params, reject);
	}

	function validateRequiredLocation(params, reject){
		validateParameter('location', 'The location parameter is required', params, reject);
	}

	function validateRequiredLat(params, reject){
		validateParameter('lat', 'The lat parameter is required', params, reject);
	}

	function validateRequiredLon(params, reject){
		validateParameter('lon', 'The lon parameter is required', params, reject);
	}

	/* Metrics */
	function validateRequiredEvent(params, reject){
		validateParameter('event', 'The event parameter is required', params, reject);
	}

	/* Mailbox */
	function validateRequiredMailbox(params, reject){
		validateParameter('handler', 'The mailbox parameter is required', params, reject);
	}

	/* Storage */
	function validateRequiredBlob(params, reject){
		validateParameter('blob', 'The blob parameter is required', params, reject);
	}

	function validateRequiredFile(params, reject){
		validateParameter('file', 'The file parameter is required', params, reject);
	}

	/* Code */
	function validateRequiredFlow(params, reject){
		validateParameter('flow', 'The flow parameter is required', params, reject);
	}

	/* Context */
	function validateRequiredState(params, reject){
		validateParameter('state', 'The state parameter is required', params, reject);
	}

    /* Document */
    function validateCollection(params, reject){
        return params.collection ? params.collection : 'documents';
    }

    /* Push */
	function validateRequiredGroup(params, reject){
		validateParameter('group', 'The group parameter is required', params, reject);
	}

	function validateRequiredCallback(params, reject){
		validateParameter('group', 'The callback parameter is required', params, reject);
	}

	/* Misc */
	function validateRequiredId(params, reject){
		validateParameter('id', 'The id is required', params, reject);
	}

	function validateRequiredData(params, reject){
		validateParameter('data', 'The data parameter is required', params, reject);
	}

	function validateParameter(name, msg, params, reject){
		if( !params[name] ){
			reject(Error(msg));
			return;
		}
	}

	function getTransactionURLParam(){
		var txId = services.getLastTransactionId();
		if( txId ){
			return 'tx=' + txId;
		}
		else{
			return 'tx=null';
		}
	}

	function getRealmResourceURL(servicePath, account, realm, resourcePath, token, ssl, params){
		var protocol = ssl ? 'https://' : 'http://';
		var txParam = getTransactionURLParam();
		var url = protocol + servicePath + 
			'/' + account + '/realms/' + realm + '/' + resourcePath + '?' + 
			(token ? 'access_token=' + token : '') +
			(txParam ? '&' + txParam : '');
		if( params ){
			for( var key in params ){
				var param = params[key];
				if( typeof param === 'object'){
					try{
						param = JSON.stringify(param);
					}
					catch(e){
						param = params[key];
					}
				}
				url += ('&' + key + '=' + param);
			}
		}
		return url;
	}

	function extractResponseValues(xhr){
		return {
			status: xhr.status,
			statusText: xhr.statusText,
			response: xhr.response,
			responseText: xhr.responseText,
			responseType: xhr.responseType,
			responseXML: xhr.responseXML
		}
	}

	function getFunctionName(fn) {
		var ret = fn.toString();
		ret = ret.substr('function '.length);
		ret = ret.substr(0, ret.indexOf('('));
		return ret;
	}

	function findFunctionInGlobalScope(fn){
		if (!fn)  {
			return null;
		}
		var functionName;
		if( typeof fn === "string" ){
			functionName = fn;
			var parts = functionName.split(".");
			var theObject = window;
			for (var i = 0; i < parts.length; i++) {
				theObject = theObject[parts[i]];
				if (!theObject) {
					return null;
				}
			}
			if (window == theObject)  {
				return null;
			}
			return theObject;
		}
		else if( typeof fn === "function" ){
			return fn;
		}
	}

	if (!b['io']) {
		b.io = {};

	}

	var services = b.io;

	//internal keys
	var TOKEN_KEY = 'bridgeitToken';
	var TOKEN_EXPIRES_KEY = 'bridgeitTokenExpires';
	var TOKEN_SET_KEY = 'bridgeitTokenSet';
	var CONNECT_SETTINGS_KEY = 'bridgeitConnectSettings';
	var LAST_ACTIVE_TS_KEY = 'bridgeitLastActiveTimestamp';
	var ACCOUNT_KEY = 'bridgeitAccount';
	var REALM_KEY = 'bridgeitRealm';
	var USERNAME_KEY = 'bridgeitUsername';
	var PASSWORD_KEY = 'bridgeitPassword';
	var RELOGIN_CB_KEY = 'bridgeitReloginCallback';
	var TRANSACTION_KEY = 'bridgeitTransaction';
	var CLOUD_CALLBACKS_KEY = "bridgeit.cloudcallbacks";
	var CLOUD_PUSH_KEY = "ice.notifyBack";
	var USER_STORE_KEY = "bridgeitUserStore";
	var USER_STORE_SETTING_KEY = "bridgeitUserStoreSetting";
	var LAST_UPDATED = "last_updated";
	var PUSH_CALLBACKS = 'pushCallbacks';

	b.$ = {

		serializePostData: function(data){
			//TODO
		},

		get: function(url, headers){
			return new Promise(function(resolve, reject) {
				var request = new XMLHttpRequest();
				request.open('GET', url, true);
				if( headers ){
					for( var header in headers ){
						request.setRequestHeader(header, headers[header]);
					}
				}
				request.onreadystatechange = function() {
					if (this.readyState === 4) {
						if (this.status >= 200 && this.status < 400) {
							resolve(this.responseText);
						} else {
							reject(extractResponseValues(this));
						}
					}
				};
				request.onabort = function(evt){
					reject(evt);
				};
				request.onerror = function(err){
					reject(err);
				};
				request.send();
				request = null;
			});
		},

		getJSON: function(url, headers){
			return new Promise(function(resolve, reject) {
				var request = new XMLHttpRequest();
				request.open('GET', url, true);
				if( headers ){
					for( var header in headers ){
						request.setRequestHeader(header, headers[header]);
					}
				}
				request.onreadystatechange = function() {
					if (this.readyState === 4) {
						if (this.status >= 200 && this.status < 400) {
							resolve(JSON.parse(this.responseText));
						} else {
							reject(extractResponseValues(this));
						}
					}
				};
				request.onabort = function(evt){
					reject(evt);
				};
				request.onerror = function(err){
					reject(err);
				};
				request.send();
				request = null;
			});
		},

		getBlob: function(url, headers){
			return new Promise(function(resolve, reject){
				var request = new XMLHttpRequest();
				if( headers ){
					for( var header in headers ){
						request.setRequestHeader(header, headers[header]);
					}
				}
				request.onreadystatechange = function(){
					if (this.readyState === 4){
						if( this.status === 200){
							resolve(new Uint8Array(this.response));
						}
						else{
							reject(this);
						}
					}
				};
				request.onabort = function(evt){
					reject(evt);
				};
				request.onerror = function(err){
					reject(err);
				};
				request.open('GET', url);
				request.responseType = 'arraybuffer';
				request.send();
				request = null;
			});
		},

		post: function(url, data, headers, isFormData, contentType, progressCallback, onabort, onerror){
			return new Promise(function(resolve, reject) {
				console.log('sending post to ' + url);
				contentType = contentType || "application/json";
				var request = new XMLHttpRequest();
				request.open('POST', url, true);
				request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
				if( !isFormData ){
					request.setRequestHeader("Content-type", contentType);
				}
				if( headers ){
					for( var header in headers ){
						request.setRequestHeader(header, headers[header]);
					}
				}
				if( progressCallback ){
					request.upload.addEventListener("progress", function(evt){
						services.auth.updateLastActiveTimestamp();
						if (evt.lengthComputable){
							var percentComplete = evt.loaded / evt.total;
							progressCallback(percentComplete, request);
						}
					}, false);
				}
				request.onabort = function(evt){
					if( onabort ){
						onabort();
					}
					reject(evt);
				};
				request.onerror = function(err){
					if( onerror ){
						request.onerror = onerror;
					}
					reject(err);
				};
				
				request.onreadystatechange = function() {
					if (this.readyState === 4) {
						if (this.status >= 200 && this.status < 400) {
							if( this.responseText ){
								var json = null;
								try{
									json = JSON.parse(this.responseText);
									resolve(json);
								}
								catch(e){
									resolve(extractResponseValues(this));
								}
							}
							else{
								resolve();
							}
						} else {
							reject(extractResponseValues(this));
						}
					}
				};
				if( data ){
					request.send(isFormData ? data : JSON.stringify(data));
				}
				else{
					request.send();
				}
			});
		},

		put: function(url, data, headers, isFormData, contentType){
			return new Promise(function(resolve, reject) {
				console.log('sending put to ' + url);
				contentType = contentType || "application/json";
				var request = new XMLHttpRequest();
				request.open('PUT', url, true);
				request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
				if( !isFormData ){
					request.setRequestHeader("Content-type", contentType);
				}
				if( headers ){
					for( var header in headers ){
						request.setRequestHeader(header, headers[header]);
					}
				}
				//request.setRequestHeader("Connection", "close");
				request.onreadystatechange = function() {
					if (this.readyState === 4) {
						if (this.status >= 200 && this.status < 400) {
							if( this.responseText ){
								var json = null;
								try{
									json = JSON.parse(this.responseText);
									resolve(json);
								}
								catch(e){
									resolve(extractResponseValues(this));
								}
							}
							else{
								resolve();
							}
						} else {
							reject(extractResponseValues(this));
						}
					}
				};
				request.onabort = function(evt){
					reject(evt);
				};
				request.onerror = function(err){
					reject(err);
				};
				if( data ){
					request.send(isFormData ? data : JSON.stringify(data));
				}
				else{
					request.send();
				}
				
				request = null;
			});
		},

		doDelete: function(url, headers){
			return new Promise(function(resolve, reject) {
				console.log('sending delete to ' + url);
				var request = new XMLHttpRequest();
				request.open('DELETE', url, true);
				if( headers ){
					for( var header in headers ){
						request.setRequestHeader(header, headers[header]);
					}
				}
				request.onreadystatechange = function() {
					if (this.readyState === 4) {
						if (this.status >= 200 && this.status < 400) {
							services.auth.updateLastActiveTimestamp();
							resolve();
						} else {
							reject(extractResponseValues(this));
						}
					}
				};
				request.onabort = function(evt){
					reject(evt);
				};
				request.onerror = function(err){
					reject(err);
				};
				request.send();
				request = null;
			});
		},

		newUUID: function()  {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
			});
		}

		
	};

	services.configureHosts = function(url){
		var isLocal = ['localhost','127.0.0.1'].indexOf(url) > -1;
		if( !url ){
			services.baseURL = 'dev.bridgeit.io';
		}
		else{
			services.baseURL = url;
		}
		var baseURL = services.baseURL;
		services.authURL = baseURL + (isLocal ? ':55010' : '') + '/auth';
		services.authAdminURL = baseURL + (isLocal ? ':55010' : '') + '/authadmin';
		services.locateURL = baseURL + (isLocal ? ':55020' : '') + '/locate';
		services.documentsURL = baseURL + (isLocal ? ':55080' : '') + '/docs';
		services.storageURL = baseURL + (isLocal ? ':55030' : '') + '/storage';
		services.metricsURL = baseURL + (isLocal ? ':55040' : '') + '/metrics';
		services.contextURL = baseURL + (isLocal ? ':55060' : '') + '/context';
		services.codeURL = baseURL + (isLocal ? ':55090' : '') + '/code';
        services.pushURL = baseURL + (isLocal ? ':8080' : '') + '/push';
        services.pushRESTURL = services.pushURL + '/rest';
        services.queryURL = baseURL + (isLocal ? ':55110' : '') + '/query';
		services.actionURL = baseURL + (isLocal ? ':55130' : '') + '/action';
		services.eventhubURL = baseURL + (isLocal ? ':55200' : '') + '/eventhub';
		services.mailboxURL = baseURL + (isLocal ? ':55120' : '') + '/mailbox';
		services.deviceURL = baseURL + (isLocal ? ':55160' : '') + '/device';
	};

	services.checkHost = function(params){
		//TODO use last configured host if available
		if( params.host ){
			services.configureHosts(params.host);
		}
	};

	services.startTransaction = function(){
		b.setSessionStorageItem(btoa(TRANSACTION_KEY), b.$.newUUID());
		console.log('bridgeit: started transaction ' + bridgeit.io.getLastTransactionId());
	};

	services.endTransaction = function(){
		b.removeSessionStorageItem(btoa(TRANSACTION_KEY));
		console.log('bridgeit: ended transaction ' + bridgeit.io.getLastTransactionId());
	};

	services.getLastTransactionId = function(){
		return b.getSessionStorageItem(btoa(TRANSACTION_KEY));
	};

	services.action = {
		/**
		 * Execute an action
		 *
		 * @alias executeAction
		 * @param {Object} params params
		 * @param {String} params.id The action id, the action to be executed
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIt host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @returns {String} The resource URI
		 */
		executeAction: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);

					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					validateRequiredId(params, reject);

					var url = getRealmResourceURL(services.actionURL, account, realm,
						'actions/' + params.id, token, params.ssl, {'op': 'exec'});

					b.$.post(url).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve(response);
					})['catch'](function(error){
						reject(error);
					});

				}
			);
		},

		/**
		 * Create a new action
		 *
		 * @alias createAction
		 * @param {Object} params params
		 * @param {String} params.id The action id
		 * @param {Object} params.action The action to be created
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIt host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @returns {String} The resource URI
		 */
		createAction: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);

					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					validateRequiredId(params, reject);
					validateRequiredAction(params, reject);

					var url = getRealmResourceURL(services.actionURL, account, realm,
						'actions/' + params.id, token, params.ssl);

					b.$.post(url, params.action).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve(response.uri);
					})['catch'](function(error){
						reject(error);
					});

				}
			);
		},

		/**
		 * Update an action
		 *
		 * @alias updateAction
		 * @param {Object} params params
		 * @param {String} params.id The action id, the action to be updated
		 * @param {Object} params.action The new action
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 */
		updateAction: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);

					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					validateRequiredId(params, reject);
					validateRequiredAction(params, reject);

					var url = getRealmResourceURL(services.actionURL, account, realm,
						'actions/' + params.id, token, params.ssl);

					b.$.put(url, params.action).then(function(){
						services.auth.updateLastActiveTimestamp();
						resolve();
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		/**
		 * Fetch an action
		 *
		 * @alias getAction
		 * @param {Object} params params
		 * @param {String} params.id The action id, the action to fetch
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @returns {Object} The action
		 */
		getAction: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);

					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					validateRequiredId(params, reject);

					var url = getRealmResourceURL(services.actionURL, account, realm,
						'actions/' + params.id, token, params.ssl);

					b.$.getJSON(url).then(function(action){
						services.auth.updateLastActiveTimestamp();
						resolve(action);
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		/**
		 * Searches for actions in a realm based on a query
		 *
		 * @alias findActions
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @param {Object} params.query A mongo query for the actions
		 * @param {Object} params.fields Specify the inclusion or exclusion of fields to return in the result set
		 * @param {Object} params.options Additional query options such as limit and sort
		 * @returns {Object} The results
		 */
		findActions: function(params){
			return new Promise(
				function(resolve, reject) {

					params = params ? params : {};
					services.checkHost(params);

					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);

					var url = getRealmResourceURL(services.actionURL, account, realm,
						'actions/', token, params.ssl, {
							'query': params.query ? encodeURIComponent(JSON.stringify(params.query)) : {},
							'fields': params.fields ? encodeURIComponent(JSON.stringify(params.fields)) : {},
							'options': params.options ? encodeURIComponent(JSON.stringify(params.options)) : {}
						});

					b.$.getJSON(url).then(function(actions){
						services.auth.updateLastActiveTimestamp();
						resolve(actions);
					})['catch'](function(response){
						reject(response);
					});

				}
			);
		},

		/**
		 * Delete an action
		 *
		 * @alias deleteAction
		 * @param {Object} params params
		 * @param {String} params.id The action id, the action to be deleted
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 */
		deleteAction: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);

					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					validateRequiredId(params, reject);

					var url = getRealmResourceURL(services.actionURL, account, realm,
						'actions/' + params.id, token, params.ssl);

					b.$.doDelete(url).then(function(){
						services.auth.updateLastActiveTimestamp();
						resolve();
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

        /**
         * Fetch available task groups
         *
         * @alias getTaskGroups
         * @param {Object} params params
         * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
         * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
         * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
         * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
         * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
         * @returns {Object} The task group schemas
         */
        getTaskGroups: function(params){
            return new Promise(
                function(resolve, reject) {
                    params = params ? params : {};
                    services.checkHost(params);

                    //validate
                    var account = validateAndReturnRequiredAccount(params, reject);
                    var realm = validateAndReturnRequiredRealm(params, reject);
                    var token = validateAndReturnRequiredAccessToken(params, reject);

                    var url = getRealmResourceURL(services.actionURL, account, realm,
                        'taskGroups/', token, params.ssl);

                    b.$.getJSON(url).then(function(tasksGroups){
                        services.auth.updateLastActiveTimestamp();
                        resolve(tasksGroups);
                    })['catch'](function(error){
                        reject(error);
                    });
                }
            );
        },

        /**
         * Fetch available tasks
         *
		 * @alias getTasks
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @returns {Object} The action
		 */
		getTasks: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);

					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);

					var url = getRealmResourceURL(services.actionURL, account, realm,
						'tasks/', token, params.ssl);

					b.$.getJSON(url).then(function(tasks){
						services.auth.updateLastActiveTimestamp();
						resolve(tasks);
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		}
	};

	services.admin = {
		
		/**
		 * Get the BridgeIt Service definitions.
		 *
		 * @alias getServiceDefinitions
		 * @param {Object} params params
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @returns Promise with a json object of the service definitions
		 *
		 */
		getServiceDefinitions: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					
					services.checkHost(params);
					
					//validate
					var token = validateAndReturnRequiredAccessToken(params, reject);
					var protocol = params.ssl ? 'https://' : 'http://';
					var txParam = getTransactionURLParam();
					var url = protocol + services.authAdminURL + '/system/services/?access_token=' + token +
						(txParam ? '&' + txParam : '');

					b.$.getJSON(url).then(function(json){
						services.auth.updateLastActiveTimestamp();
						resolve(json);
					})['catch'](function(error){
						reject(error);
					});
			
				}
			);
		},

		getAccount: function(params){
			return new Promise(function(resolve, reject) {
				params = params ? params : {};
				services.checkHost(params);
				
				//validate
				var account = validateAndReturnRequiredAccount(params, reject);
				var token = validateAndReturnRequiredAccessToken(params, reject);
				
				var protocol = params.ssl ? 'https://' : 'http://';
				var txParam = getTransactionURLParam();
				var url = protocol + services.authAdminURL + '/' + account + '?access_token=' + token +
					(txParam ? '&' + txParam : '');

				b.$.getJSON(url).then(function(json){
					services.auth.updateLastActiveTimestamp();
					resolve(json.account);
				})['catch'](function(error){
					reject(error);
				});
		
			});
		},

		/* Realm admin */		

		getRealms: function(params){
			return new Promise(function(resolve, reject) {
				params = params ? params : {};
				services.checkHost(params);
				
				//validate
				var account = validateAndReturnRequiredAccount(params, reject);
				var token = validateAndReturnRequiredAccessToken(params, reject);
				
				var protocol = params.ssl ? 'https://' : 'http://';
				var url = protocol + services.authAdminURL + '/' + account + '/realms/'
						+ '?access_token=' + token + getTransactionURLParam();

				b.$.getJSON(url).then(function(json){
					services.auth.updateLastActiveTimestamp();
					resolve(json.realms);
				})['catch'](function(error){
					reject(error);
				});
			
			});
		},

		getRealm: function(params){
			return new Promise(function(resolve, reject) {
				params = params ? params : {};
				services.checkHost(params);
				
				var account = validateAndReturnRequiredAccount(params, reject);
				var token = validateAndReturnRequiredAccessToken(params, reject);
				var realm = validateAndReturnRequiredRealmName(params, reject);
				
				var url = getRealmResourceURL(services.authAdminURL, account, realm, 
					'', token, params.ssl);

				b.$.getJSON(url).then(function(json){
					services.auth.updateLastActiveTimestamp();
					resolve(json.realm);
				})['catch'](function(error){
					reject(error);
				});
			
			});
		},

		updateRealm: function(params){
			return new Promise(function(resolve, reject) {
				params = params ? params : {};
				services.checkHost(params);
				
				var account = validateAndReturnRequiredAccount(params, reject);
				var token = validateAndReturnRequiredAccessToken(params, reject);
				validateRequiredRealm(params, reject);
				
				var url = getRealmResourceURL(services.authAdminURL, account, params.realm.name, 
					'', token, params.ssl);

				b.$.put(url, {realm: params.realm}).then(function(){
					services.auth.updateLastActiveTimestamp();
					resolve();
				})['catch'](function(error){
					reject(error);
				});
			
			});
		},

		createRealm: function(params){
			return new Promise(function(resolve, reject) {
				params = params ? params : {};
				services.checkHost(params);
				
				var account = validateAndReturnRequiredAccount(params, reject);
				var token = validateAndReturnRequiredAccessToken(params, reject);
				var realmName = validateAndReturnRequiredRealmName(params, reject);
				validateRequiredRealm(params, reject);
				
				var protocol = params.ssl ? 'https://' : 'http://';
				var txParam = getTransactionURLParam();
				var url = protocol + services.authAdminURL + '/' + account + '/realms?access_token=' + token +
					(txParam ? '&' + txParam : '');

				b.$.post(url, {realm: params.realm}).then(function(json){
					services.auth.updateLastActiveTimestamp();
					resolve(json.resourceLocation);
				})['catch'](function(error){
					reject(error);
				});
			
			});
		},

		deleteRealm: function(params){
			return new Promise(function(resolve, reject) {
				params = params ? params : {};
				services.checkHost(params);
				
				var account = validateAndReturnRequiredAccount(params, reject);
				var token = validateAndReturnRequiredAccessToken(params, reject);
				var realmName = validateAndReturnRequiredRealmName(params, reject);
				
				var url = getRealmResourceURL(services.authAdminURL, account, realmName, 
					'', token, params.ssl);

				b.$.doDelete(url).then(function(){
					services.auth.updateLastActiveTimestamp();
					resolve();
				})['catch'](function(error){
					reject(error);
				});
			
			});
		},

		/* Realm Users */

		getRealmUsers: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);

					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealmName(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);

					var url = getRealmResourceURL(services.authAdminURL, account, realm,
						'users', token, params.ssl);

					b.$.getJSON(url).then(function(json){
						services.auth.updateLastActiveTimestamp();
						resolve(json.users);
					})['catch'](function(error){
						reject(error);
					});

				}
			);
		},

		createRealmUser: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);

					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealmName(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);

					validateRequiredUser(params, reject);

					var url = getRealmResourceURL(services.authAdminURL, account, realm, 
						'users', services.auth.getLastAccessToken(), params.ssl);

					b.$.post(url, {user: params.user}).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve(response.resourceLocation);
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		getRealmUser: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealmName(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					var username = validateAndReturnRequiredUsername(params, reject);
					
					var url = getRealmResourceURL(services.authAdminURL, account, realm, 
						'users/' + username, token, params.ssl);

					b.$.getJSON(url).then(function(json){
						services.auth.updateLastActiveTimestamp();
						resolve(json.user);
					})['catch'](function(error){
						reject(error);
					});
			
				}
			);
		},

		updateRealmUser: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);

					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealmName(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);

					validateRequiredUser(params, reject);

					var url = getRealmResourceURL(services.authAdminURL, account, realm, 
						'users/' + params.user.username, services.auth.getLastAccessToken(), params.ssl);

					b.$.put(url, {user: params.user}).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve();
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		deleteRealmUser: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);

					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealmName(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);

					validateRequiredUsername(params, reject);

					var url = getRealmResourceURL(services.authAdminURL, account, realm, 
						'users/' + params.username, services.auth.getLastAccessToken(), params.ssl);

					b.$.doDelete(url).then(function(){
						services.auth.updateLastActiveTimestamp();
						resolve();
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		/* Realm Roles */

		getRealmRoles: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealmName(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					
					var url = getRealmResourceURL(services.authAdminURL, account, realm, 
						'roles', token, params.ssl);

					b.$.getJSON(url).then(function(json){
						services.auth.updateLastActiveTimestamp();
						resolve(json.roles);
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		createRealmRole: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);

					validateRequiredRole(params, reject);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealmName(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					
					var url = getRealmResourceURL(services.authAdminURL, account, realm, 
						'roles', token, params.ssl);

					b.$.post(url, {role: params.role}).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve(response.resourceLocation);
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		updateRealmRole: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);

					validateRequiredRole(params, reject);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealmName(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					
					var url = getRealmResourceURL(services.authAdminURL, account, realm, 
						'roles/' + params.role.name, token, params.ssl);

					b.$.put(url, {role: params.role}).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve();
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		deleteRealmRole: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);

					validateRequiredId(params, reject);
					
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealmName(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					
					var url = getRealmResourceURL(services.authAdminURL, account, realm, 
						'roles/' + params.id, token, params.ssl);

					b.$.doDelete(url).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve();
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		getLogs: function(params) {
			return new Promise(function(resolve, reject) {
				params = params ? params : {};
				services.checkHost(params);

				var protocol = params.ssl ? 'https://' : 'http://';
				var account = validateAndReturnRequiredAccount(params, reject);
				var token = validateAndReturnRequiredAccessToken(params, reject);

				var query = params.query ? encodeURIComponent(JSON.stringify(params.query)) : '{}';
				var fields = params.fields ? encodeURIComponent(JSON.stringify(params.fields)) : '{}';
				var options = params.options ? encodeURIComponent(JSON.stringify(params.options)) : '{}';

				var url = protocol + services.authAdminURL + '/' + account + '/logging/?access_token=' +
						token + '&query=' + query + '&fields=' + fields + '&options=' + options;

				b.$.getJSON(url).then(function(logs){
					services.auth.updateLastActiveTimestamp();
					resolve(logs);
				})['catch'](function(error){
					reject(error);
				});

			});
		},

		getDebugLogs: function(params) {
			return new Promise(function(resolve, reject) {
				params = params ? params : {};
				services.checkHost(params);

				var protocol = params.ssl ? 'https://' : 'http://';
				var account = validateAndReturnRequiredAccount(params, reject);
				var realm = validateAndReturnRequiredRealm(params, reject);
				var token = validateAndReturnRequiredAccessToken(params, reject);

				var query = params.query ? encodeURIComponent(JSON.stringify(params.query)) : '{}';
				var fields = params.fields ? encodeURIComponent(JSON.stringify(params.fields)) : '{}';
				var options = params.options ? encodeURIComponent(JSON.stringify(params.options)) : '{}';

				var url = protocol + services.authAdminURL + '/' + account + '/realms/' + realm +
					'/debugLogging/?access_token=' + token + '&query=' + query + '&fields=' + fields + '&options=' + options;

				b.$.getJSON(url).then(function(logs){
					services.auth.updateLastActiveTimestamp();
					resolve(logs);
				})['catch'](function(error){
					reject(error);
				});

			});
		}
	};

	/* AUTH SERVICE */
	services.auth = {

		/**
		 * Retrieve a new access token from the BridgeIt auth service.
		 *
		 * The function returns a Promise that, when successful, returns an object with the following structure:
		 *    {
		 *       "access_token": "d9f7463d-d100-42b6-aecd-ae21e38e5d02",
		 *       "expires_in": 1420574793844
		 *    }
		 * 
		 * Which contains the access token and the time, in milliseconds that the session will expire in.
		 *
		 * Unlike the login, and connect functions, this function does not store the access token after it
		 * is retrieved.
		 *
		 * @alias getNewAccessToken
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name (required)
		 * @param {String} params.realm BridgeIt Services realm (required only for non-admin logins)
		 * @param {String} params.username User name (required)
		 * @param {String} params.password User password (required)
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @returns Promise with the following argument:
		 *      {
		 *          access_token: 'xxx',
		 *          expires_in: 99999
		 *      }
		 *
		 */
		 getNewAccessToken: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);

					if( !params.realm ){
						params.realm = 'admin';
					}
					
					//validation
					if( !params.account ){
						reject(Error('BridgeIt account required for new access token'));
						return;
					}
					if( !params.password ){
						reject(Error('password required for new access token'));
						return;
					}
					if( !params.username ){
						reject(Error('username required for new access token'));
						return;
					}
					var protocol = params.ssl ? 'https://' : 'http://';
					var url = protocol + services.authURL + '/' + encodeURI(params.account) + 
						'/realms/' + encodeURI(params.realm) + '/token/?' + getTransactionURLParam();

					b.$.post(url, {
						strategy: 'query', 
						username: params.username, 
						password: params.password
					}).then(function(authResponse){
												resolve(authResponse);
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		/**
		 * Login into bridgeit services. 
		 *
		 * This function will login into the BridgeIt auth service and return a user token and expiry timestamp upon 
		 * successful authentication. This function does not need to be called if bridgeit.connect has already been
		 * called, as that function will automatically extend the user session, unless the timeout has passed. 
		 *
		 * The function returns a Promise that, when successful, returns an object with the following structure:
		 *    {
		 *       "access_token": "d9f7463d-d100-42b6-aecd-ae21e38e5d02",
		 *       "expires_in": 1420574793844
		 *    }
		 * 
		 * Which contains the access token and the time, in milliseconds that the session will expire in.
		 *
		 * @alias login
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name (required)
		 * @param {String} params.realm BridgeIt Services realm (required only for non-admin logins)
		 * @param {String} params.username User name (required)
		 * @param {String} params.password User password (required)
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @returns Promise with the following argument:
		 *      {
		 *          access_token: 'xxx',
		 *          expires_in: 99999
		 *      }
		 *
		 */
		login: function(params) {
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);

					if( !params.realm ){
						params.realm = 'admin';
					}
					
					//validation
					if( !params.account ){
						reject(Error('BridgeIt account required for login'));
						return;
					}
					if( !params.password ){
						reject(Error('password required for login'));
						return;
					}
					if( !params.username ){
						reject(Error('username required for login'));
						return;
					}
					var protocol = params.ssl ? 'https://' : 'http://';
					var txParam = getTransactionURLParam();
					var url = protocol + services.authURL + '/' + encodeURI(params.account) + 
						'/realms/' + encodeURI(params.realm) + '/token/' + ( txParam ? ('?' + txParam) : '');

					var loggedInAt = new Date().getTime();
					b.$.post(url, {
						strategy: 'query', 
						username: params.username, 
						password: params.password
					}).then(function(authResponse){
						if( !params.suppressUpdateTimestamp ){
							services.auth.updateLastActiveTimestamp();
						}
						b.setSessionStorageItem(btoa(TOKEN_KEY), authResponse.access_token);
						b.setSessionStorageItem(btoa(TOKEN_EXPIRES_KEY), authResponse.expires_in);
						b.setSessionStorageItem(btoa(TOKEN_SET_KEY), loggedInAt);
						b.setSessionStorageItem(btoa(ACCOUNT_KEY), btoa(params.account));
						b.setSessionStorageItem(btoa(REALM_KEY), btoa(params.realm));
						b.setSessionStorageItem(btoa(USERNAME_KEY), btoa(params.username));

						resolve(authResponse);
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		/**
		 * Connect to bridgeit services. 
		 *
		 * This function will connect to the BridgeIt services, and maintain the connection for the specified 
		 * timeout period (default 20 minutes). By default, the BridgeIt push service is also activated, so the client
		 * may send and receive push notifications after connecting.
		 *
		 * After connecting to BridgeIt Services, any BridgeIt service API may be used without needing to re-authenticate.
		 * After successfully connection an authentication will be stored in session storage and available through 
		 * sessionStorage.bridgeitToken. This authentication information will automatically be used by other BridgeIt API
		 * calls, so the token does not be included in subsequent calls, but is available if desired.
		 *
		 * A simple example of connecting to the BridgeIt Services and then making a service call is the following:
		 *
		 * bridgeit.connect({
		 *           account: 'my_account', 
		 *           realm: 'realmA', 
		 *           user: 'user', 
		 *           password: 'secret'})
		 *   .then( function(){
		 *      console.log("successfully connnected to BridgeIt Services");
		 *      //now we can fetch some docs
		 *      return bridgeit.docService.get('documents');
		 *   })
		 *   .then( function(docs){
		 *      for( var d in docs ){ ... };
		 *   })
		 *   .catch( function(error){
		 *      console.log("error connecting to BridgeIt Services: " + error);
		 *   });
		 *
		 * @alias connect
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name
		 * @param {String} params.realm BridgeIt Services realm
		 * @param {String} params.username User name
		 * @param {String} params.password User password
		 * @param {String} params.host The BridgeIt Services host url, defaults to api.bridgeit.io
		 * @param {Boolean} params.usePushService Open and connect to the BridgeIt push service, default true
		 * @param {Boolean} params.connectionTimeout The timeout duration, in minutes, that the BridgeIt login will last during inactivity. Default 20 minutes.
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @param {Boolean} params.storeCredentials (default true) Whether to store encrypted credentials in session storage. If set to false, bridgeit will not attempt to relogin before the session expires.
		 * @param {Function} params.onSessionExpiry Function callback to be called on session expiry. If you wish to ensure that disconnect is not called until after your onSessionExpiry callback has completed, please return a Promise from your function.
		 * @returns Promise with service definitions
		 *
		 */
		connect: function(params){
			return new Promise(function(resolve, reject) {

				function initConnectCallback(){

					function connectCallback(){
						console.log(new Date().toISOString() + ' bridgeit connect: callback running')
						var connectSettings = services.auth.getConnectSettings();
						if( !connectSettings ){
							console.log(new Date().toISOString() + ' bridgeit connect: error, could not retrieve settings');
							return;
						}

						var timeoutMillis = connectSettings.connectionTimeout * 60 * 1000;	

						//first check if connectionTimeout has expired
						var now = new Date().getTime();
						console.log('bridgeit.getLastActiveTimestamp: ' + services.auth.getLastActiveTimestamp());
						console.log('bridgeit timeout ms: ' + timeoutMillis);
						console.log('bridgeit now ms: ' + now);
						if( ( now - services.auth.getLastActiveTimestamp()) < timeoutMillis ){
							console.log(new Date().toISOString() + ' bridgeit connect: timeout has not been exceeded, ' + services.auth.getTimeRemainingBeforeExpiry()/1000/60 + ' mins remaining');

							if( (connectSettings.connectionTimeout * 1000 * 60 ) > services.auth.getTimeRemainingBeforeExpiry()){
								
								var loginParams = services.auth.getConnectSettings();
								loginParams.account = atob(b.getSessionStorageItem(btoa(ACCOUNT_KEY)));
								loginParams.realm = atob(b.getSessionStorageItem(btoa(REALM_KEY)));
								loginParams.username = atob(b.getSessionStorageItem(btoa(USERNAME_KEY)));
								loginParams.password = atob(b.getSessionStorageItem(btoa(PASSWORD_KEY)));
								loginParams.suppressUpdateTimestamp = true;

								services.auth.login(loginParams).then(function(authResponse){
									fireEvent(window, 'bridgeit-access-token-refreshed', services.auth.getLastAccessToken());
									if( loginParams.usePushService ){
										services.push.startPushService(loginParams);
									}
									setTimeout(connectCallback, services.auth.getTimeRemainingBeforeExpiry() - timeoutPadding);
								})['catch'](function(response){
									var msg = new Date().toISOString() + ' bridgeit connect: error relogging in: ' + response.responseText;
									console.error(msg);
									reject(response);
									throw new Error(msg);
								});
							}
							else{
								console.log( new Date().toISOString() + ' bridgeit connect: setting callback for ' + connectSettings.connectionTimeout + ' minutes');
								setTimeout(connectCallback, connectSettings.connectionTimeout * 60 * 1000);
							}
						}
						else{
							console.log( new Date().toISOString() + ' bridgeit connect: timeout has expired, disconnecting..');
							

							//look for the onSessionExpiry callback on the params first,
							//as functions could be passed by reference
							//secondly by settings, which would only be passed by name
							var expiredCallback = params.onSessionExpiry;
							if( !expiredCallback ){
								expiredCallback = connectSettings.onSessionExpiry;
							}

							//if there's no onSessionExpiry, call disconnect immediately
							//otherwise search for onSessionExpiry function, if not found
							//call disconnect() immediately, otherwise call onSessionExpiry
							//if callback if a promise, wait until the promise completes 
							//before disconnecting, otherwise, wait 500ms then disconnect
							if( expiredCallback ){
								var expiredCallbackFunction;
								if( typeof expiredCallback === 'function'){
									expiredCallbackFunction = expiredCallback;
								}
								else if( typeof expiredCallback === 'string'){
									expiredCallbackFunction = findFunctionInGlobalScope(expiredCallback);
								}
								if( expiredCallbackFunction ){
									var expiredCallbackPromise = expiredCallbackFunction();
									if( expiredCallbackPromise && expiredCallbackPromise.then ){
										expiredCallbackPromise.then(services.auth.disconnect)
										['catch'](services.auth.disconnect);
									}
									else{
										setTimeout(services.auth.disconnect, 500);
									}
								}
								else{
									console.log( new Date().toISOString() + ' bridgeit connect: error calling onSessionExpiry callback, ' +
										'could not find function: ' + expiredCallback);
									services.auth.disconnect();
								}

							}	
							else{
								services.auth.disconnect();
							}
							
						}
					}

					var callbackTimeout;

					//if the desired connection timeout is greater the token expiry
					//set the callback check for just before the token expires
					if( connectionTimeoutMillis > services.auth.getExpiresIn()){
						callbackTimeout = services.auth.getTimeRemainingBeforeExpiry() - timeoutPadding;
					}
					//otherwise the disired timeout is less then the token expiry
					//so set the callback to happen just at specified timeout
					else{
						callbackTimeout = connectionTimeoutMillis;
					}

					console.log( new Date().toISOString() + ' bridgeit connect: setting timeout to ' + callbackTimeout / 1000 / 60 + ' mins, expiresIn: ' + services.auth.getExpiresIn() + ', remaining: '  + services.auth.getTimeRemainingBeforeExpiry());
					var cbId = setTimeout(connectCallback, callbackTimeout);
					b.setSessionStorageItem(btoa(RELOGIN_CB_KEY), cbId);
				}

				var timeoutPadding = 500;
				params = params ? params : {};
				services.checkHost(params);
				if( !params.storeCredentials){
					params.storeCredentials = true;
				}

				//store connect settings
				var settings = {
					host: services.baseURL,
					usePushService: params.usePushService,
					connectionTimeout: params.connectionTimeout || 20,
					ssl: params.ssl,
					storeCredentials: params.storeCredentials || true,
					onSessionExpiry: params.onSessionExpiry
				};
				b.setSessionStorageItem(btoa(CONNECT_SETTINGS_KEY), btoa(JSON.stringify(settings)));

				if( params.onSessionExpiry ){
					if( typeof params.onSessionExpiry === 'function'){
						var name = getFunctionName(params.onSessionExpiry);
						if( name ){
							settings.onSessionExpiry = name;
						}
					}
				}

				var connectionTimeoutMillis =  settings.connectionTimeout * 60 * 1000;	

				if( services.auth.isLoggedIn()){
					initConnectCallback();
					if( settings.usePushService ){
						services.push.startPushService(settings);
					}
					resolve();
				}
				else{
					services.auth.login(params).then(function(authResponse){
						console.log('bridgeit.io.auth.connect: ' + new Date().toISOString() + ' received auth response');                
						b.setSessionStorageItem(btoa(ACCOUNT_KEY), btoa(bridgeit.io.auth.getLastKnownAccount()));
						b.setSessionStorageItem(btoa(REALM_KEY), btoa(bridgeit.io.auth.getLastKnownRealm()));
						b.setSessionStorageItem(btoa(USERNAME_KEY), btoa(params.username));
						b.setSessionStorageItem(btoa(PASSWORD_KEY), btoa(params.password));
						initConnectCallback();	
						if( settings.usePushService ){
							services.push.startPushService(settings);
						}
						resolve();
					})['catch'](function(error){
						reject(error);
					});
				}
			});
		},

		refreshAccessToken: function(){
			return new Promise(function(resolve, reject) {
				if( !services.auth.isLoggedIn()){
					reject('bridgeit.io.auth.refreshAccessToken() not logged in, cant refresh token');
				}
				else{
					var loginParams = services.auth.getConnectSettings();
					if( !loginParams ){
						reject('bridgeit.io.auth.refreshAccessToken() no connect settings, cant refresh token');
					}
					else{
						loginParams.account = atob(b.getSessionStorageItem(btoa(ACCOUNT_KEY)));
						loginParams.realm = atob(b.getSessionStorageItem(btoa(REALM_KEY)));
						loginParams.username = atob(b.getSessionStorageItem(btoa(USERNAME_KEY)));
						loginParams.password = atob(b.getSessionStorageItem(btoa(PASSWORD_KEY)));
						loginParams.suppressUpdateTimestamp = true;

						services.auth.login(loginParams).then(function(authResponse){
							fireEvent(window, 'bridgeit-access-token-refreshed', services.auth.getLastAccessToken());
							if( loginParams.usePushService ){
								services.push.startPushService(loginParams);
							}
							resolve(authResponse);
						})['catch'](function(response){
							reject(response);
						});
					}
				}
				
			});
		},

		/**
		 * Disconnect from BridgeIt Services.
		 *
		 * This function will logout from BridgeIt Services and remove all session information from the client.
		 *
		 * TODO
		 *
		 * @alias disconnect
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.username User name (required)
		 * @param {String} params.password User password (required)
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @returns Promise with the following argument:
		 *      {
		 *          access_token: 'xxx',
		 *          expires_in: 99999
		 *      }
		 *
		 */
		disconnect: function(){
			b.removeSessionStorageItem(btoa(TOKEN_KEY));
			b.removeSessionStorageItem(btoa(TOKEN_EXPIRES_KEY));
			b.removeSessionStorageItem(btoa(CONNECT_SETTINGS_KEY));
			b.removeSessionStorageItem(btoa(TOKEN_SET_KEY));
			b.removeSessionStorageItem(btoa(ACCOUNT_KEY));
			b.removeSessionStorageItem(btoa(REALM_KEY));
			b.removeSessionStorageItem(btoa(USERNAME_KEY));
			b.removeSessionStorageItem(btoa(PASSWORD_KEY));
			b.removeSessionStorageItem(btoa(LAST_ACTIVE_TS_KEY));
			var cbId = b.getSessionStorageItem(btoa(RELOGIN_CB_KEY));
			if( cbId ){
				clearTimeout(cbId);
			}
			b.removeSessionStorageItem(btoa(RELOGIN_CB_KEY));
			console.log(new Date().toISOString() + ' bridgeit has disconnected')
		},

		getLastAccessToken: function(){
			return b.getSessionStorageItem(btoa(TOKEN_KEY));
		},

		getExpiresIn: function(){
			var expiresInStr = b.getSessionStorageItem(btoa(TOKEN_EXPIRES_KEY));
			if( expiresInStr ){
				return parseInt(expiresInStr,10);
			}
		},

		getTokenSetAtTime: function(){
			var tokenSetAtStr = b.getSessionStorageItem(btoa(TOKEN_SET_KEY));
			if( tokenSetAtStr ){
				return parseInt(tokenSetAtStr,10);
			}
		},

		getTimeRemainingBeforeExpiry: function(){
			var expiresIn = services.auth.getExpiresIn();
			var token = services.auth.getExpiresIn();
			if( expiresIn && token ){
				var now = new Date().getTime();
				return (services.auth.getTokenSetAtTime() + expiresIn) - now;
			}
		},

		getConnectSettings: function(){
			var settingsStr = b.getSessionStorageItem(btoa(CONNECT_SETTINGS_KEY));
			if( settingsStr ){
				return JSON.parse(atob(settingsStr));
			}
		},

		isLoggedIn: function(){
			var token = b.getSessionStorageItem(btoa(TOKEN_KEY)),
				tokenExpiresInStr = b.getSessionStorageItem(btoa(TOKEN_EXPIRES_KEY)),
				tokenExpiresIn = tokenExpiresInStr ? parseInt(tokenExpiresInStr,10) : null,
				tokenSetAtStr = b.getSessionStorageItem(btoa(TOKEN_SET_KEY)),
				tokenSetAt = tokenSetAtStr ? parseInt(tokenSetAtStr,10) : null,
				result = token && tokenExpiresIn && tokenSetAt && (new Date().getTime() < (tokenExpiresIn + tokenSetAt) );
			return !!result;
		},

		getLastKnownAccount: function(){
			var accountCipher = b.getSessionStorageItem(btoa(ACCOUNT_KEY));
			if( accountCipher ){
				return atob(accountCipher);
			}
		},

		getLastKnownRealm: function(){
			var realmCipher = b.getSessionStorageItem(btoa(REALM_KEY));
			if( realmCipher ){
				return atob(realmCipher);
			}
		},

        getLastKnownUsername: function () {
			var usernameCipher = b.getSessionStorageItem(btoa(USERNAME_KEY));
            if (usernameCipher) {
                return atob(usernameCipher);
            }
        },


        /**
		 * Register a new user for a realm that supports open user registrations.
		 *
		 * @alias registerAsNewUser
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.username User name (required)
		 * @param {String} params.password User password (required)
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @param {String} params.firstname The user's first name (optional)
		 * @param {String} params.lastname The user's last name (optional)
		 * @param {String} params.email The user's email (optional)
		 * @param {Object} params.custom Custom user information
		 * @returns Promise 
		 */
		registerAsNewUser: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);

					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);

					validateRequiredUsername(params, reject);
					validateRequiredPassword(params, reject);

					var user = {
						username: params.username,
						password: params.password
					};

					if( 'firstname' in params ){
						user.firstname = params.firstname;
					}
					if( 'lastname' in params ){
						user.lastname = params.lastname;
					}
					if( 'email' in params ){
						user.email = params.email;
					}
					if( 'custom' in params ){
						user.custom = params.custom;
					}

					var url = getRealmResourceURL(services.authAdminURL, account, realm, 
						'quickuser', services.auth.getLastAccessToken(), params.ssl);

					b.$.post(url, {user: user}).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve(response);
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		/**
		 * Check if the current user has a set of permissions.
		 *
		 * @alias checkUserPermissions 
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @param {String} params.permissions A space-delimited list of permissions
		 * @returns Promise 
		 */
		 checkUserPermissions: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);
					
					validateRequiredPermissions(params, reject);

					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);

					var url = getRealmResourceURL(services.authURL, account, realm, 
						'permission', token, params.ssl);

					b.$.post(url, {permissions: params.permissions}).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve(true);
					})['catch'](function(response){
						if( response.status == 403){
							services.auth.updateLastActiveTimestamp();
							resolve(false);
						}
						else{
							reject(error);
						}
					});
				}
			);
		},

		/**
		 * Check if the current user has a set of roles.
		 *
		 * @alias checkUserRoles 
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @param {String} params.roles A space-delimited list of permissions
		 * @param {String} params.op 'and' (default) or 'or' or 'single'
		 * @returns Promise 
		
		 checkUserRoles: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);
					
					validateRequiredPermissions(params, reject);

					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);

					 /authadmin/:accountname/realms/:realmname/roles/:username/rolecheck

					var url = getRealmResourceURL(services.authAdminURL, account, realm, 
						'roles/' + , token, params.ssl);

					b.$.post(url, {permissions: params.permissions}).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve(true);
					})['catch'](function(response){
						if( response.status == 403){
							services.auth.updateLastActiveTimestamp();
							resolve(false);
						}
						else{
							reject(error);
						}
					});
				}
			);
		},
		 */

		/**
		 * Update the last active timestamp for BridgeIt auth. This value is used
		 * when checking for clients-side session timeouts.
		 * @alias updateLastActiveTimestamp
		 */
		updateLastActiveTimestamp: function(){
			b.setSessionStorageItem(btoa(LAST_ACTIVE_TS_KEY), new Date().getTime());
		},
		
		/**
		 * Return the timestamp of the last bridgeit op or when bridgeit.io.auth.updateLastActiveTimestamp() 
		 * was called.
		 * @alias getLastActiveTimestamp
		 */
		getLastActiveTimestamp: function(){
			return b.getSessionStorageItem(btoa(LAST_ACTIVE_TS_KEY));
		},

		/**
		 * User the browser local storage to cache the user store. This will allow access to the user store 
		 * when the user is offline or when the server is not accessible.
		 * 
		 * @alias enableUserStoreCache
		 *
		 */
		enableUserStoreCache: function(){
			if( !services.auth.isLoggedIn() ){
				console.log('not logged in, cannot access user store');
				return;
			}
			var userStoreSettings;
			var username = services.auth.getLastKnownUsername();
			if( !username ){
				console.log('username not available, cannot access user store');
				return;
			}	
			var userStoreSettingsStr = b.getLocalStorageItem(btoa(USER_STORE_SETTING_KEY));
			if( !userStoreSettingsStr ){
				userStoreSettings = {};
			}
			else{
				userStoreSettings = JSON.parse(atob(userStoreSettingsStr));
			}
			userStoreSettings[username] = new Date().getTime();
			b.setLocalStorageItem(btoa(USER_STORE_SETTING_KEY), btoa(JSON.stringify(userStoreSettings)));
			
		},

		/**
		 * Disaled the browser local storage to cache the user store. 
		 * 
		 * @alias disableUserStoreCache
		 *
		 */
		disableUserStoreCache: function(){
			if( !services.auth.isLoggedIn() ){
				console.log('not logged in, cannot access user store');
				return;
			}
			var userStoreSettings;
			var username = services.auth.getLastKnownUsername();
			if( !username ){
				console.log('username not available, cannot access user store');
				return;
			}	
			var userStoreSettingsStr = b.getLocalStorageItem(btoa(USER_STORE_SETTING_KEY));
			if( !userStoreSettingsStr ){
				userStoreSettings = {};
			}
			else{
				userStoreSettings = JSON.parse(atob(userStoreSettingsStr));
			}
			userStoreSettings[username] = null;
			b.setLocalStorageItem(btoa(USER_STORE_SETTING_KEY), btoa(JSON.stringify(userStoreSettings)));
			
		},

		/**
		 * Returns true if enableUserStoreCache() has previously been called and the user store
		 * cache is active.
		 * @alias isUserStoreCacheActive
		 */
		isUserStoreCacheActive: function(){
			if( !services.auth.isLoggedIn() ){
				console.log('not logged in, cannot access user store');
				return;
			}
			var userStoreSettings;
			var username = services.auth.getLastKnownUsername();
			if( !username ){
				console.log('username not available, cannot access user store');
				return;
			}	
			var userStoreSettingsStr = b.getLocalStorageItem(btoa(USER_STORE_SETTING_KEY));
			if( !userStoreSettingsStr ){
				return false;
			}
			else{
				userStoreSettings = JSON.parse(atob(userStoreSettingsStr));
				return !!userStoreSettings[username];
			}
		},

		/**
		 * Set an item by key and value in the user store. The user store is updated
		 * on the server side user record 'custom' property. 
		 * 
		 * If the user store cache is active, the cache will also be updated.
		 *
		 * The userStore.last_updated property will be updated with the current time.
		 * When the server side store is updated, this 'last_updated' timestamp will
		 * be verified. If the server side timestamp is later than the previous 'last_updated'
		 * timestamp, the operation will be rejected, and the returned promise will reject
		 * with the current server side userStore value.
		 *
		 * The key and value must be parsable as JSON strings. 
		 *
		 * @alias setItemInUserStore
		 * @param {string} key the key
		 * @param {string} value the value
		 * @returns a Promise with no argument, if successful, or with the server side userStore if a conflict occurs
		 */
		setItemInUserStore: function(key, value){
			return new Promise(function(resolve, reject) {
				function updateServerUserStore(userStore, previousLastUpdated){
					return services.admin.getRealmUser().then(function(user){
						var customProp = user.custom;
						if( !customProp ){
							user.custom = userStore;
						}
						else{
							//compare timestamps 
							var customObj;
							try{
								customObj = JSON.parse(customProp);
								var thatTS = customObj[LAST_UPDATED];
								if( !thatTS || !previousLastUpdated){
									user.custom = userStore;
								}
								else{
									if( thatTS > previousLastUpdated ){
										console.log('ERROR: userStore update conflict' );
										reject(userStore);
										return;
									}
									else{
										user.custom = userStore;
									}
								}
							}
							catch(e){
								user.custom = userStore;
							}
							
						}
						return services.admin.updateRealmUser({user: user}).then(function(){
							resolve();
						})['catch'](function(error){
							console.log('could not update server side user object: ' + error);
							reject('could not update server side user object: ' + error);
						});
					})
				}
				if( !key ){
					reject('The key is required');
					return;
				}

				return services.auth.getUserStore().then(function(userStore){
					userStore[key] = value;
					var prevTS = userStore[LAST_UPDATED];
					userStore[LAST_UPDATED] = new Date().getTime();
					if( services.auth.isUserStoreCacheActive() ){
						return services.auth.saveUserStoreToCache().then(function(){
							return updateServerUserStore(userStore, prevTS);
						});
					}
					else{
						return updateServerUserStore(userStore);
					}
				})['catch'](function(error){
					reject(error);
				})
			});
		},

		/**
		 * Get an item by key from the user store. The user store is checked
		 * on the server side user record 'custom' property. 
		 * 
		 * @alias getItemInUserStore
		 * @param {string} key the key
		 */
		getItemInUserStore: function(key){
			return new Promise(function(resolve, reject) {
				return services.auth.getUserStore().then(function(userStore){
					resolve(userStore[key]);
				})['catch'](function(error){
					reject(error);
				})
			});
		},

		/**
		 * Get the user store for the current user. The user must be logged in to 
		 * access the store. The user store is persisted on the 'custom' property 
		 * of the user record, and can be used to store any relevant information for 
		 * user.
		 * 
		 * @alias getUserStore
		 * @returns A promise with the userStore object if successful.
		 */
		getUserStore: function(){
			return new Promise(function(resolve, reject) {
				if( !services.auth.isLoggedIn() ){
					console.log('not logged in, cannot access user store');
					return null;
				}
				if( !(USER_STORE_KEY in window) ){
					var userStoreCache;
					if( services.auth.isUserStoreCacheActive()){
						userStoreCache = services.auth.getUserStoreCache();
					}
					if( navigator.onLine ){
						return services.admin.getRealmUser().then( function(user){
							console.log('getUserStore() retrieved realm user');
							var userStore = user.custom;
							if( !userStore ){
								userStore = {};
							}
							else if( typeof userStore === 'string'){
								try{
									userStore = JSON.parse(userStore); 
								}
								catch(e){
									userStore = {};
								}
							}
							else if( typeof userStore !== 'object' ){
								console.log('getUserStore() could not process user record store object: ' + userStore);
								reject();
								return;
							}
							window[USER_STORE_KEY] = userStore;
							if( services.auth.isUserStoreCacheActive()){
								return services.auth.saveUserStoreToCache().then(function(){
									return resolve(userStore);
								});
							}
							else{
								resolve(userStore);
							}
						})['catch'](function(error){
							console.log('getUserStore() could not retrieve user from server: ' + error);
							if( userStoreCache ){
								resolve(userStoreCache);
							}
							else{
								reject(error);
							}
							
						});
					}
					else if( userStoreCache ){
						resolve(userStoreCache);
					}
					else{
						reject('could not retrieve uncached user store while offline');
					}
					
				}
				else{
					resolve(window[USER_STORE_KEY]);
				}
			});
		},

		saveUserStoreToCache: function(){
			return new Promise(function(resolve, reject) {
				if( !services.auth.isLoggedIn() ){
					console.log('not logged in, cannot access user store');
					reject('not logged in, cannot access user store');
					return;
				}
				if( !services.auth.isUserStoreCacheActive() ){
					console.log('user store cache is not active, cannot save locally');
					reject('user store cache is not active, cannot save locally')
					return;
				}
				var username = services.auth.getLastKnownUsername();
				if( !username ){
					console.log('username not available, cannot access user store');
					reject('username not available, cannot access user store')
					return;
				}	
				else{
					return services.auth.getUserStore().then(function(userStore){
						var storeKeyCipher = btoa(USER_STORE_KEY);
						var userStoreCacheStr = b.getLocalStorageItem(storeKeyCipher);
						var userStoreCache;
						if( userStoreCacheStr ){
							userStoreCache = JSON.parse(atob(userStoreCacheStr));
						}
						else{
							userStoreCache = {};
						}
						userStoreCache[username] = userStore;
						b.setLocalStorageItem(storeKeyCipher, btoa(JSON.stringify(userStoreCache)));
						resolve();
						return;
					})['catch'](function(error){
						reject(error);
						return;
					})

				}
			});
			
		},

		getUserStoreCache: function(){
			if( !services.auth.isLoggedIn() ){
				console.log('not logged in, cannot access user store');
				reject('not logged in, cannot access user store');
				return;
			}
			if( !services.auth.isUserStoreCacheActive() ){
				console.log('user store cache is not active, cannot save locally');
				reject('user store cache is not active, cannot save locally')
				return;
			}
			var username = services.auth.getLastKnownUsername();
			if( !username ){
				console.log('username not available, cannot access user store');
				reject('username not available, cannot access user store')
				return;
			}	
			var storeKeyCipher = btoa(USER_STORE_KEY);
			var userStoreCacheStr = b.getLocalStorageItem(storeKeyCipher);
			var userStoreCache;
			if( userStoreCacheStr ){
				userStoreCache = JSON.parse(atob(userStoreCacheStr));
			}
			else{
				userStoreCache = {};
			}
			var userStoreCacheObject = userStoreCache[username];
			if( !userStoreCacheObject ){
				userStoreCacheObject = {};
			}
			return userStoreCacheObject;
		}

	};

	/* DOC SERVICE */
	services.documents = {

		/**
		 * Create a new document
		 *
		 * @alias createDocument
		 * @param {Object} params params
         * @param {String} params.collection The name of the document collection.  Defaults to 'documents'.
         * @param {String} params.id The document id. If not provided, the service will return a new id
		 * @param {Object} params.document The document to be created
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @returns {String} The resource URI
		 */
		createDocument: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
                    var collection = validateCollection(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);

					var url = getRealmResourceURL(services.documentsURL, account, realm, 
						collection + '/' + (params.id ? params.id : ''), token, params.ssl);

					b.$.post(url, params.document).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve(response.uri);
					})['catch'](function(error){
						reject(error);
					});
			
				}
			);			
		},

		/**
		 * Update a document
		 *
		 * @alias updateDocument
		 * @param {Object} params params
         * @param {String} params.collection The name of the document collection.  Defaults to 'documents'.
         * @param {String} params.id The document id.
		 * @param {Object} params.document The document to be created
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @returns {String} The resource URI
		 */
		updateDocument: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
                    var collection = validateCollection(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					validateRequiredId(params, reject);

					var url = getRealmResourceURL(services.documentsURL, account, realm, 
					    collection + '/' + params.id, token, params.ssl);

					b.$.put(url, params.document).then(function(){
						services.auth.updateLastActiveTimestamp();
						resolve();
					})['catch'](function(error){
						reject(error);
					});
				}
			);			
		},

		/**
		 * Fetch a document
		 *
		 * @alias getDocument
		 * @param {Object} params params
         * @param {String} params.collection The name of the document collection.  Defaults to 'documents'.
         * @param {String} params.id The document id. If not provided, the service will return a new id
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @returns {Object} The document
		 */
		 getDocument: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
                    var collection = validateCollection(params, reject);
                    var token = validateAndReturnRequiredAccessToken(params, reject);
					validateRequiredId(params, reject);

					var url = getRealmResourceURL(services.documentsURL, account, realm, 
					    collection + '/' + params.id, token, params.ssl);

					b.$.getJSON(url).then(function(doc){
						services.auth.updateLastActiveTimestamp();
						//the document service always returns a list, so 
						//check if we have a list of one, and if so, return the single item
						if( doc.length && doc.length === 1 ){
							resolve(doc[0]);
						}
						else{
							resolve(doc);
						}	
					})['catch'](function(error){
						reject(error);
					});
				}
			);			
		},

		/**
		 * Searches for documents in a realm based on a query
		 *
		 * @alias findDocuments
		 * @param {Object} params params
         * @param {String} params.collection The name of the document collection.  Defaults to 'documents'.
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
         * @param {Object} params.query A mongo query for the documents
         * @param {Object} params.fields Specify the inclusion or exclusion of fields to return in the result set
         * @param {Object} params.options Additional query options such as limit and sort
		 * @returns {Object} The results
		 */
		 findDocuments: function(params){
			return new Promise(
				function(resolve, reject) {

					params = params ? params : {};
					services.checkHost(params);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
                    var collection = validateCollection(params, reject);
                    var token = validateAndReturnRequiredAccessToken(params, reject);

					var url = getRealmResourceURL(services.documentsURL, account, realm, 
						collection, token, params.ssl, {
							'query': params.query ? encodeURIComponent(JSON.stringify(params.query)) : {},
                            'fields': params.fields ? encodeURIComponent(JSON.stringify(params.fields)) : {},
                            'options': params.options ? encodeURIComponent(JSON.stringify(params.options)) : {}
					});

					b.$.getJSON(url).then(function(doc){
						services.auth.updateLastActiveTimestamp();
						resolve(doc);
					})['catch'](function(response){
						//service currently returns a 404 when no documents are found
						if( response.status == 404 ){
							resolve(null);
						}
						else{
							reject(response);
						}
					});
			
				}
			);			
		},

		/**
		 * Delete a new document
		 *
		 * @alias deleteDocument
		 * @param {Object} params params
         * @param {String} params.collection The name of the document collection.  Defaults to 'documents'.
         * @param {String} params.id The document id. If not provided, the service will return a new id
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 */
		deleteDocument: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
                    var collection = validateCollection(params, reject);
                    var token = validateAndReturnRequiredAccessToken(params, reject);
					validateRequiredId(params, reject);

					var url = getRealmResourceURL(services.documentsURL, account, realm, 
						collection + '/' + params.id, token, params.ssl);

					b.$.doDelete(url).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve();
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		}

	};

	services.eventhub = {
		/**
		 * Create a new event handler
		 *
		 * @alias createHandler
		 * @param {Object} params params
		 * @param {String} params.id The handler id
		 * @param {Object} params.handler The event handler to be created
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIt host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @returns {String} The resource URI
		 */
		createHandler: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);

					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					validateRequiredHandler(params, reject);

					var url = getRealmResourceURL(services.eventhubURL, account, realm,
						'handlers/' + (params.id ? params.id : ''), token, params.ssl);

					b.$.post(url, params.handler).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve(response.uri);
					})['catch'](function(error){
						reject(error);
					});

				}
			);
		},

		/**
		 * Update an event handler
		 *
		 * @alias updateHandler
		 * @param {Object} params params
		 * @param {String} params.id The handler id, the event handler to be updated
		 * @param {Object} params.handler The new event handler
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 */
		updateHandler: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);

					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					validateRequiredId(params, reject);
					validateRequiredHandler(params, reject);

					var url = getRealmResourceURL(services.eventhubURL, account, realm,
						'handlers/' + params.id, token, params.ssl);

					b.$.put(url, params.handler).then(function(){
						services.auth.updateLastActiveTimestamp();
						resolve();
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		/**
		 * Fetch an event handler
		 *
		 * @alias getHandler
		 * @param {Object} params params
		 * @param {String} params.id The handler id, the event handler to fetch
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @returns {Object} The event handler
		 */
		getHandler: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);

					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					validateRequiredId(params, reject);

					var url = getRealmResourceURL(services.eventhubURL, account, realm,
						'handlers/' + params.id, token, params.ssl);

					b.$.getJSON(url).then(function(handler){
						services.auth.updateLastActiveTimestamp();
						resolve(handler);
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		/**
		 * Searches for event handlers in a realm based on a query
		 *
		 * @alias findHandlers
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @param {Object} params.query A mongo query for the event handlers
		 * @param {Object} params.fields Specify the inclusion or exclusion of fields to return in the result set
		 * @param {Object} params.options Additional query options such as limit and sort
		 * @returns {Object} The results
		 */
		findHandlers: function(params){
			return new Promise(
				function(resolve, reject) {

					params = params ? params : {};
					services.checkHost(params);

					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);

					var url = getRealmResourceURL(services.eventhubURL, account, realm,
						'handlers/', token, params.ssl, {
							'query': params.query ? encodeURIComponent(JSON.stringify(params.query)) : {},
							'fields': params.fields ? encodeURIComponent(JSON.stringify(params.fields)) : {},
							'options': params.options ? encodeURIComponent(JSON.stringify(params.options)) : {}
						});

					b.$.getJSON(url).then(function(handlers){
						services.auth.updateLastActiveTimestamp();
						resolve(handlers);
					})['catch'](function(response){
						reject(response);
					});

				}
			);
		},

		/**
		 * Delete an event handler
		 *
		 * @alias deleteHandler
		 * @param {Object} params params
		 * @param {String} params.id The handler id, the event handler to be deleted
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 */
		deleteHandler: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);

					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					validateRequiredId(params, reject);

					var url = getRealmResourceURL(services.eventhubURL, account, realm,
						'handlers/' + params.id, token, params.ssl);

					b.$.doDelete(url).then(function(){
						services.auth.updateLastActiveTimestamp();
						resolve();
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		/**
		 * Delete event handlers in a realm based on a query
		 *
		 * @alias deleteHandlers
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @param {Object} params.query A mongo query for the event handlers
		 * @param {Object} params.fields Specify the inclusion or exclusion of fields to return in the result set
		 * @param {Object} params.options Additional query options such as limit and sort
		 */
		deleteHandlers: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);

					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);

					var url = getRealmResourceURL(services.eventhubURL, account, realm,
						'handlers/', token, params.ssl, {
							'query': params.query ? encodeURIComponent(JSON.stringify(params.query)) : {},
							'fields': params.fields ? encodeURIComponent(JSON.stringify(params.fields)) : {},
							'options': params.options ? encodeURIComponent(JSON.stringify(params.options)) : {}
						});

					b.$.doDelete(url).then(function(){
						services.auth.updateLastActiveTimestamp();
						resolve();
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		/**
		 * Create a new event recognizer
		 *
		 * @alias createRecognizer
		 * @param {Object} params params
		 * @param {String} params.id The recognizer id
		 * @param {Object} params.recognizer The event recognizer to be created
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIt host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @returns {String} The resource URI
		 */
		createRecognizer: function(params) {
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);

					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					validateRequiredRecognizer(params, reject);

					var url = getRealmResourceURL(services.eventhubURL, account, realm,
						'recognizers/' + (params.id ? params.id : ''), token, params.ssl);

					b.$.post(url, params.recognizer).then(function(response) {
						services.auth.updateLastActiveTimestamp();
						resolve(response.uri);
					})['catch'](function(error) {
						reject(error);
					});

				}
			);
		},

		/**
		 * Update an event recognizer
		 *
		 * @alias updateRecognizer
		 * @param {Object} params params
		 * @param {String} params.id The recognizer id, the event recognizer to be updated
		 * @param {Object} params.recognizer The new event recognizer
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 */
		updateRecognizer: function(params) {
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);

					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					validateRequiredId(params, reject);
					validateRequiredRecognizer(params, reject);

					var url = getRealmResourceURL(services.eventhubURL, account, realm,
						'recognizers/' + params.id, token, params.ssl);

					b.$.put(url, params.recognizer).then(function() {
						services.auth.updateLastActiveTimestamp();
						resolve();
					})['catch'](function(error) {
						reject(error);
					});
				}
			);
		},

		/**
		 * Fetch an event recognizer
		 *
		 * @alias getRecognizer
		 * @param {Object} params params
		 * @param {String} params.id The recognizer id, the event recognizer to fetch
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @returns {Object} The event recognizer
		 */
		getRecognizer: function(params) {
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);

					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					validateRequiredId(params, reject);

					var url = getRealmResourceURL(services.eventhubURL, account, realm,
						'recognizers/' + params.id, token, params.ssl);

					b.$.getJSON(url).then(function(recognizer) {
						services.auth.updateLastActiveTimestamp();
						resolve(recognizer);
					})['catch'](function(error) {
						reject(error);
					});
				}
			);
		},

		/**
		 * Searches for event recognizers in a realm based on a query
		 *
		 * @alias findRecognizers
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @param {Object} params.query A mongo query for the event recognizers
		 * @param {Object} params.fields Specify the inclusion or exclusion of fields to return in the result set
		 * @param {Object} params.options Additional query options such as limit and sort
		 * @returns {Object} The results
		 */
		findRecognizers: function(params) {
			return new Promise(
				function(resolve, reject) {

					params = params ? params : {};
					services.checkHost(params);

					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);

					var url = getRealmResourceURL(services.eventhubURL, account, realm,
						'recognizers/', token, params.ssl, {
							'query': params.query ? encodeURIComponent(JSON.stringify(params.query)) : {},
							'fields': params.fields ? encodeURIComponent(JSON.stringify(params.fields)) : {},
							'options': params.options ? encodeURIComponent(JSON.stringify(params.options)) : {}
						});

					b.$.getJSON(url).then(function(recognizers) {
						services.auth.updateLastActiveTimestamp();
						resolve(recognizers);
					})['catch'](function(response) {
						reject(response);
					});

				}
			);
		},

		/**
		 * Delete an event recognizer
		 *
		 * @alias deleteRecognizer
		 * @param {Object} params params
		 * @param {String} params.id The recognizer id, the event recognizer to be deleted
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 */
		deleteRecognizer: function(params) {
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);

					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					validateRequiredId(params, reject);

					var url = getRealmResourceURL(services.eventhubURL, account, realm,
						'recognizers/' + params.id, token, params.ssl);

					b.$.doDelete(url).then(function() {
						services.auth.updateLastActiveTimestamp();
						resolve();
					})['catch'](function(error) {
						reject(error);
					});
				}
			);
		},

		/**
		 * Delete event recognizers in a realm based on a query
		 *
		 * @alias deleteRecognizers
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @param {Object} params.query A mongo query for the event recognizers
		 * @param {Object} params.fields Specify the inclusion or exclusion of fields to return in the result set
		 * @param {Object} params.options Additional query options such as limit and sort
		 */
		deleteRecognizers: function(params) {
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);

					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);

					var url = getRealmResourceURL(services.eventhubURL, account, realm,
						'recognizers/', token, params.ssl, {
							'query': params.query ? encodeURIComponent(JSON.stringify(params.query)) : {},
							'fields': params.fields ? encodeURIComponent(JSON.stringify(params.fields)) : {},
							'options': params.options ? encodeURIComponent(JSON.stringify(params.options)) : {}
						});

					b.$.doDelete(url).then(function() {
						services.auth.updateLastActiveTimestamp();
						resolve();
					})['catch'](function(error) {
						reject(error);
					});
				}
			);
		}
	};

	/* LOCATE SERVICE */
	services.location = {

		/**
		 * Create a new region
		 *
		 * @alias createRegion
		 * @param {Object} params params
		 * @param {String} params.id The region id. If not provided, the service will return a new id
		 * @param {Object} params.region The region geoJSON document that describes the region to be created
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @returns {String} The resource URI
		 */
		 createRegion: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					validateRequiredRegion(params, reject);

					var url = getRealmResourceURL(services.locateURL, account, realm,
						'regions/' + (params.id ? params.id : ''), token, params.ssl);
					
					b.$.post(url, params.region).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve(response.uri);
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		/**
		 * Update a region
		 *
		 * @alias updateRegion
		 * @param {Object} params params
		 * @param {String} params.id The region id, the region to be updated
		 * @param {Object} params.region The new region
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 */
		updateRegion: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);

					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					validateRequiredId(params, reject);
					validateRequiredRegion(params, reject);

					var url = getRealmResourceURL(services.locateURL, account, realm,
							'regions/' + params.id, token, params.ssl);

					b.$.put(url, params.region).then(function(){
						services.auth.updateLastActiveTimestamp();
						resolve();
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		/**
		 * Delete a new region
		 *
		 * @alias deleteRegion
		 * @param {Object} params params
		 * @param {String} params.id The region id. 
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 */
		 deleteRegion: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					validateRequiredId(params, reject);

					var url = getRealmResourceURL(services.locateURL, account, realm, 
						'regions/' + params.id, token, params.ssl);

					b.$.doDelete(url).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve();
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		/**
		 * Fetches all saved regions for the realm
		 *
		 * @alias getAllRegions
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @returns {Object} The results
		 */
		 getAllRegions: function(params){
			return new Promise(
				function(resolve, reject) {

					params = params ? params : {};
					services.checkHost(params);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);

					var url = getRealmResourceURL(services.locateURL, account, realm, 
						'regions', token, params.ssl);

					b.$.getJSON(url).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve(response);
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		/**
		 * Searches for regions in a realm based on a query
		 *
		 * @alias findRegions
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
         * @param {Object} params.query A mongo query for the regions
         * @param {Object} params.fields Specify the inclusion or exclusion of fields to return in the result set
         * @param {Object} params.options Additional query options such as limit and sort
		 * @returns {Object} The results
		 */
		 findRegions: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);

					var url = getRealmResourceURL(services.locateURL, account, realm, 
						'regions', token, params.ssl, {
                            'query': params.query ? encodeURIComponent(JSON.stringify(params.query)) : {},
                            'fields': params.fields ? encodeURIComponent(JSON.stringify(params.fields)) : {},
                            'options': params.options ? encodeURIComponent(JSON.stringify(params.options)) : {}
                        });

					b.$.getJSON(url).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve(response);
					})['catch'](function(error){
						if( error.status === 404 ){
							resolve();
						}
						else{
							reject(error);
						}
					});
				}
			);
		},

		/**
		 * Searches for monitors in a realm based on a query
		 *
		 * @alias findMonitors
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
         * @param {Object} params.query A mongo query for the monitors
         * @param {Object} params.fields Specify the inclusion or exclusion of fields to return in the result set
         * @param {Object} params.options Additional query options such as limit and sort
		 * @returns {Object} The results
		 */
		 findMonitors: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);

					var url = getRealmResourceURL(services.locateURL, account, realm, 
						'monitors', token, params.ssl, {
                            'query': params.query ? encodeURIComponent(JSON.stringify(params.query)) : {},
                            'fields': params.fields ? encodeURIComponent(JSON.stringify(params.fields)) : {},
                            'options': params.options ? encodeURIComponent(JSON.stringify(params.options)) : {}
                        });

					b.$.getJSON(url).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve(response);
					})['catch'](function(error){
						if( error.status === 404 ){
							resolve();
						}
						else{
							reject(error);
						}
					});
				}
			);
		},

		/**
		 * Create a new location monitor
		 *
		 * @alias createMonitor
		 * @param {Object} params params
		 * @param {String} params.id The monitor id. If not provided, the service will return a new id
		 * @param {Object} params.monitor The monitor document that describes the monitor to be created
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @returns {String} The resource URI
		 */
		 createMonitor: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					validateRequiredMonitor(params, reject);

					var url = getRealmResourceURL(services.locateURL, account, realm, 
						'monitors' + (params.id ? '/' + params.id : ''), token, params.ssl);

					b.$.post(url, params.monitor).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve(response.uri);
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		/**
		 * Delete a new monitor
		 *
		 * @alias deleteMonitor
		 * @param {Object} params params
		 * @param {String} params.id The region id. 
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 */
		 deleteMonitor: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					validateRequiredId(params, reject);

					var url = getRealmResourceURL(services.locateURL, account, realm, 
						'monitors/' + params.id, token, params.ssl);

					b.$.doDelete(url).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve();
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		/**
		 * Fetches all saved monitors for the realm
		 *
		 * @alias getAllMonitors
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @returns {Object} The results
		 */
		 getAllMonitors: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);

					var url = getRealmResourceURL(services.locateURL, account, realm, 
						'monitors', token, params.ssl);

					b.$.getJSON(url).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve(response);
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		/**
		 * Create a new location point of interest
		 *
		 * @alias createPOI
		 * @param {Object} params params
		 * @param {String} params.id The POI id. If not provided, the service will return a new id
		 * @param {Object} params.poi The POI document that describes the POI to be created
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @returns {String} The resource URI
		 */
		 createPOI: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					validateRequiredPOI(params, reject);

					var url = getRealmResourceURL(services.locateURL, account, realm, 
						'poi' + (params.id ? '/' + params.id : ''), token, params.ssl);

					b.$.post(url, params.poi).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve(response.uri);
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		/**
		 * Update a poi
		 *
		 * @alias updatePOI
		 * @param {Object} params params
		 * @param {String} params.id The poi id, the poi to be updated
		 * @param {Object} params.poi The new poi
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 */
		updatePOI: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);

					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					validateRequiredId(params, reject);
					validateRequiredPOI(params, reject);

					var url = getRealmResourceURL(services.locateURL, account, realm,
							'poi/' + params.id, token, params.ssl);

					b.$.put(url, params.poi).then(function(){
						services.auth.updateLastActiveTimestamp();
						resolve();
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		/**
		 * Searches for POIs in a realm based on a query
		 *
		 * @alias findPOIs
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
         * @param {Object} params.query A mongo query for the points of interest
         * @param {Object} params.fields Specify the inclusion or exclusion of fields to return in the result set
         * @param {Object} params.options Additional query options such as limit and sort
		 * @returns {Object} The results
		 */
		 findPOIs: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);

					var url = getRealmResourceURL(services.locateURL, account, realm, 
						'poi', token, params.ssl, {
                            'query': params.query ? encodeURIComponent(JSON.stringify(params.query)) : {},
                            'fields': params.fields ? encodeURIComponent(JSON.stringify(params.fields)) : {},
                            'options': params.options ? encodeURIComponent(JSON.stringify(params.options)) : {}
                        });

					b.$.getJSON(url).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve(response);
					})['catch'](function(error){
						if( error.status === 404 ){
							resolve();
						}
						else{
							reject(error);
						}
					});
				}
			);
		},

		/**
		 * Delete a new POI
		 *
		 * @alias deletePOI
		 * @param {Object} params params
		 * @param {String} params.id The POI id. 
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 */
		 deletePOI: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					validateRequiredId(params, reject);

					var url = getRealmResourceURL(services.locateURL, account, realm, 
						'poi/' + params.id, token, params.ssl);

					b.$.doDelete(url).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve();
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		/**
		 * Fetches all saved POIs for the realm
		 *
		 * @alias getAllPOIs
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @returns {Object} The results
		 */
		 getAllPOIs: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);

					var url = getRealmResourceURL(services.locateURL, account, realm, 
						'poi', token, params.ssl);

					b.$.getJSON(url).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve(response);
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		/**
		 * Searches for locations in a realm based on a query
		 *
		 * @alias findLocations
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
         * @param {Object} params.query A mongo query for the locations
         * @param {Object} params.fields Specify the inclusion or exclusion of fields to return in the result set
         * @param {Object} params.options Additional query options such as limit and sort
		 * @returns {Object} The results
		 */
		 findLocations: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);

					var url = getRealmResourceURL(services.locateURL, account, realm, 
						'locations', token, params.ssl, {
                            'query': params.query ? encodeURIComponent(JSON.stringify(params.query)) : {},
                            'fields': params.fields ? encodeURIComponent(JSON.stringify(params.fields)) : {},
                            'options': params.options ? encodeURIComponent(JSON.stringify(params.options)) : {}
                        });

					b.$.getJSON(url).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve(response);
					})['catch'](function(error){
						if( error.status === 404 ){
							resolve();
						}
						else{
							reject(error);
						}
					});
				}
			);
		},

		/**
		 * Update the location of the current user.
		 *
		 * @alias updateLocation
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @param {Object} params.location The location
		 */
		 updateLocation: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					validateRequiredLocation(params, reject);
					
					var url = getRealmResourceURL(services.locateURL, account, realm, 
						'locations', token, params.ssl);

					b.$.post(url, params.location).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve(response);
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		/**
		 * Set the current users location with a latitude and longitude
		 *
		 * @alias updateLocationCoordinates
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @param {Number} params.latitude The location latitude
		 * @param {Number} params.longitude The location longitude
		 * @param {String} params.label An optional label
		 */
		 updateLocationCoordinates: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					validateRequiredLat(params, reject);
					validateRequiredLon(params, reject);

					var location = {
						location: {
							geometry: {
								type: 'Point',
								coordinates: [ params.lon, params.lat ]
							},
							properties: {
								timestamp: new Date().toISOString()
							}
						}
					};

					if( params.label ){
						location.label = params.label;
					}
					
					var url = getRealmResourceURL(services.locateURL, account, realm, 
						'locations', token, params.ssl);

					b.$.post(url, location).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve(response);
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},


		/**
		 * Get the last known user location from the location service.
		 *
		 * @alias getLastUserLocation
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @param {String} params.username
		 * @returns {Object} The single result, if any, of the user location.
		 

		 http://dev.bridgeit.io/locate/bsrtests/realms/test/locations
		 	?access_token=4be2fc2f-a53b-4987-9446-88d519faaa77
		 	&query={%22username%22:%22user%22}
		 	&options={%22sort%22:[[%22lastUpdated%22,%22desc%22]]}
		 	&results=one

		 var locationURL = apiURL + '/locations' +
                    '?access_token=' + encodeURIComponent(bsr.auth.getCurrentToken()) +
                    '&query={"username": "' + encodeURIComponent(user) + '"} +' +
                    '&options={"sort":[["lastUpdated","desc"]]}' +
                    '&results=one';
         */

		 getLastUserLocation: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					var username = validateAndReturnRequiredUsername(params, reject);

                    var url = getRealmResourceURL(services.locateURL, account, realm,
                        'locations/' + username, token, params.ssl, {
                            'results': 'last'
                        });

                    b.$.getJSON(url).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve(response);
					})['catch'](function(response){
						if( response.status === 403 ){
							resolve(null);
						}
						else{
							reject(response);
						}
					});
				}
			);
		}
	};

	services.mailbox = {
		/**
		 * Create a new mailbox
		 *
		 * @alias createMailbox
		 * @param {Object} params params
		 * @param {String} params.id The user id
		 * @param {Object} params.mailbox The mailbox to be created
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIt host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @returns {String} The resource URI
		 */
		createMailbox: function (params) {
			return new Promise(
				function (resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);

					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					validateRequiredMailbox(params, reject);

					var url = getRealmResourceURL(services.mailboxURL, account, realm,
						'mailboxes/' + (params.id ? params.id : ''), token, params.ssl);

					b.$.post(url, params.mailbox).then(function (response) {
						services.auth.updateLastActiveTimestamp();
						resolve(response.uri);
					})['catch'](function (error) {
						reject(error);
					});

				}
			);
		},

		/**
		 * Update a mailbox
		 *
		 * @alias updateMailbox
		 * @param {Object} params params
		 * @param {String} params.id The user id, the user's mailbox to be updated
		 * @param {Object} params.mailbox The new mailbox
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 */
		updateMailbox: function (params) {
			return new Promise(
				function (resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);

					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					validateRequiredId(params, reject);
					validateRequiredMailbox(params, reject);

					var url = getRealmResourceURL(services.mailboxURL, account, realm,
						'mailboxes/' + params.id, token, params.ssl);

					b.$.put(url, params.mailbox).then(function () {
						services.auth.updateLastActiveTimestamp();
						resolve();
					})['catch'](function (error) {
						reject(error);
					});
				}
			);
		},

		/**
		 * Fetch a mailbox
		 *
		 * @alias getMailbox
		 * @param {Object} params params
		 * @param {String} params.id The user id, the user's mailbox to fetch
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @returns {Object} The mailbox
		 */
		getMailbox: function (params) {
			return new Promise(
				function (resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);

					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					validateRequiredId(params, reject);

					var url = getRealmResourceURL(services.mailboxURL, account, realm,
						'mailboxes/' + params.id, token, params.ssl);

					b.$.getJSON(url).then(function (mailbox) {
						services.auth.updateLastActiveTimestamp();
						resolve(mailbox);
					})['catch'](function (error) {
						reject(error);
					});
				}
			);
		},

		/**
		 * Searches for mailboxes in a realm based on a query
		 *
		 * @alias findMailboxes
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @param {Object} params.query A mongo query for the mailboxes
		 * @param {Object} params.fields Specify the inclusion or exclusion of fields to return in the result set
		 * @param {Object} params.options Additional query options such as limit and sort
		 * @returns {Object} The results
		 */
		findMailboxes: function (params) {
			return new Promise(
				function (resolve, reject) {

					params = params ? params : {};
					services.checkHost(params);

					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);

					var url = getRealmResourceURL(services.mailboxURL, account, realm,
						'mailboxes/', token, params.ssl, {
							'query': params.query ? encodeURIComponent(JSON.stringify(params.query)) : {},
							'fields': params.fields ? encodeURIComponent(JSON.stringify(params.fields)) : {},
							'options': params.options ? encodeURIComponent(JSON.stringify(params.options)) : {}
						});

					b.$.getJSON(url).then(function (mailboxes) {
						services.auth.updateLastActiveTimestamp();
						resolve(mailboxes);
					})['catch'](function (response) {
						reject(response);
					});

				}
			);
		},

		/**
		 * Delete a mailbox
		 *
		 * @alias deleteMailbox
		 * @param {Object} params params
		 * @param {String} params.id The user id, the user's mailbox to be deleted
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 */
		deleteMailbox: function (params) {
			return new Promise(
				function (resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);

					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					validateRequiredId(params, reject);

					var url = getRealmResourceURL(services.mailboxURL, account, realm,
						'mailboxes/' + params.id, token, params.ssl);

					b.$.doDelete(url).then(function () {
						services.auth.updateLastActiveTimestamp();
						resolve();
					})['catch'](function (error) {
						reject(error);
					});
				}
			);
		},

		/**
		 * Delete mailboxes in a realm based on a query
		 *
		 * @alias deleteMailboxes
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @param {Object} params.query A mongo query for the mailboxes
		 * @param {Object} params.fields Specify the inclusion or exclusion of fields to return in the result set
		 * @param {Object} params.options Additional query options such as limit and sort
		 */
		deleteMailboxes: function (params) {
			return new Promise(
				function (resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);

					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);

					var url = getRealmResourceURL(services.mailboxURL, account, realm,
						'mailboxes/', token, params.ssl, {
							'query': params.query ? encodeURIComponent(JSON.stringify(params.query)) : {},
							'fields': params.fields ? encodeURIComponent(JSON.stringify(params.fields)) : {},
							'options': params.options ? encodeURIComponent(JSON.stringify(params.options)) : {}
						});

					b.$.doDelete(url).then(function () {
						services.auth.updateLastActiveTimestamp();
						resolve();
					})['catch'](function (error) {
						reject(error);
					});
				}
			);
		}
	};

	/* METRICS SERVICE */
	services.metrics = {

		/**
		 * Searches for events in a realm based on a query
		 *
		 * @alias findEvents
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @param {Object} params.query A mongo query for the events
		 * @param {Object} params.fields Specify the inclusion or exclusion of fields to return in the result set
		 * @param {Object} params.options Additional query options such as limit and sort
		 * @returns {Object} The results
		 */
		findEvents: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);

					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);

					var url = getRealmResourceURL(services.metricsURL, account, realm,
						'events', token, params.ssl, {
							'query': params.query ? encodeURIComponent(JSON.stringify(params.query)) : {},
							'fields': params.fields ? encodeURIComponent(JSON.stringify(params.fields)) : {},
							'options': params.options ? encodeURIComponent(JSON.stringify(params.options)) : {}
						});

					b.$.getJSON(url).then(function(events){
						services.auth.updateLastActiveTimestamp();
						resolve(events);
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		/**
		 * Store a custom event in the metrics service.
		 *
		 * @alias createCustomEvent
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @param {Object} params.event The custom event that you would like to store, in JSON format.
         * @returns {String} The resource URI
		 */
        createCustomEvent: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
                    validateRequiredEvent(params, reject);

					var url = getRealmResourceURL(services.metricsURL, account, realm, 
						'events', token, params.ssl);

                    b.$.post(url, params.event).then(function(response){
                        services.auth.updateLastActiveTimestamp();
                        resolve(response.uri);
                    })['catch'](function(error){
                        reject(error);
                    });
				}
			);
		},

		/**
		 * Retrieve the time difference in milliseconds between the provided time and the metrics server time.
		 *
		 * Useful for displaying accurate live metrics views. The time difference is returned as client time - server time.
		 *
		 * @alias getClientServerTimeGap
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @returns {Number} The time difference in milliseconds
		 */
		 getClientServerTimeGap: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);

					var url = getRealmResourceURL(services.metricsURL, account, realm, 
						'time', token, params.ssl, {
							clientTime: encodeURIComponent(new Date().toISOString())
						});

					b.$.getJSON(url).then(function(response){
						if( response.timeOffset){
							services.auth.updateLastActiveTimestamp();
							resolve(response.timeOffset);
						}
						else{
							reject(new Error('getClientServerTimeGap() could not parse response: ' + 
								JSON.stringify(response)));
						}
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		}


	};

	/* PUSH SERVICE */
	services.push = {

		/**
		 * Connect to the BridgeIt Push Service
		 *
		 * @alias startPushService
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 */
		startPushService: function(params){
			return new Promise(
				function(resolve, reject) {

					/*
					function setupCloudPush()  {
						var cloudPushId = getCloudPushId();
						if (!!cloudPushId)  {
							if (ice.push)  {
								console.log("Cloud Push registered: " + cloudPushId);
								ice.push.parkInactivePushIds(cloudPushId);
							}
						}
					}

					function getCloudPushId()  {
						return b.getLocalStorageItem(CLOUD_PUSH_KEY);
					}*/
					params = params ? params : {};
					services.checkHost(params);
					
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					
					var pushURL = (params.ssl ? 'https://' : 'http://') + services.pushURL + '/';

					b.usePushService(pushURL, null, {
						auth:{
							access_token: token
						},
						account: account, 
						realm: realm
					});
					console.log('bridgeit.io.push.connect() connected');
					resolve();

					/*
					b.$.get(pushURL + 'code.icepush').then(function(response){
						try{
							eval(response);
							ice.push.configuration.contextPath = pushURL;
							ice.push.configuration.account = bridgeit.io.auth.getLastKnownAccount();
							ice.push.configuration.realm = bridgeit.io.auth.getLastKnownRealm();
							ice.push.configuration.access_token = bridgeit.io.auth.getLastAccessToken();
							ice.push.connection.startConnection();
							setupCloudPush();
							console.log('bridgeit.io.push.connect() connected');
							resolve();
						}
						catch(e){
							console.log('bridgeit.io.push.connect() failed: ' + e);
							reject(e);
						}
					})['catch'](function(error){
						reject(error);
					});*/
				}
			);
		},

		
		/**
		 * Add listener for notifications belonging to the specified group.
	 	 * Callbacks must be passed by name to receive cloud push notifications.
		 *
		 * @alias addPushListener
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.group The push group name
		 * @param {String} params.callback The callback function to be called on the push event
		 * @param {Boolean} params.useCloudPush Use BridgeIt Cloud Push to call the callback through native cloud notification channels when necessary (default true)
		 */
		addPushListener: function(params){
			return new Promise(function(resolve, reject) {

				function storePushListener(pushId, group, cb){
					var pushListeners = {};
					var pushListenersStr = b.getSessionStorageItem(PUSH_CALLBACKS);
					if( pushListenersStr ){
						try{
							pushListeners = JSON.parse(pushListenersStr);
						}
						catch(e){}
					}
					if( !pushListeners[group] ){
						pushListeners[group] = [];
					}
					pushListeners[group].push({pushId: pushId, callback: cb});
					b.setSessionStorageItem(PUSH_CALLBACKS, JSON.stringify(pushListeners));
				}

				function addCloudPushListener(){
					var callback = findFunctionInGlobalScope(params.callback);
					if( !callback ){
						reject('BridgeIt Cloud Push callbacks must be in window scope. Please pass either a reference to or a name of a global function.');
					}
					else{	
						var callbacks = b.getLocalStorageItem(CLOUD_CALLBACKS_KEY);
						var callbackName = getFunctionName(callback);
						if (!callbacks)  {
							callbacks = " ";
						}
						if (callbacks.indexOf(" " + callbackName + " ") < 0)  {
							callbacks += callbackName + " ";
						}
						b.setLocalStorageItem(CLOUD_CALLBACKS_KEY, callbacks);
					}
				}

				function addPushGroupMember(){
					ice.push.connection.resumeConnection();
					var pushId = ice.push.createPushId();
					ice.push.addGroupMember(params.group, pushId);
					var fn = findFunctionInGlobalScope(params.callback);
					if( !fn ){
						reject('could not find function in global scope: ' + params.callback);
					}
					else{
						ice.push.register([ pushId ], fn);
						storePushListener(pushId, params.group, params.callback);
						if( params.useCloudPush ){
							addCloudPushListener();
						}
					}
					
				}
					
				params = params ? params : {};
				services.checkHost(params);
				
				validateRequiredGroup(params, reject);
				validateRequiredCallback(params, reject);

				if( !('useCloudPush' in params )){
					params.useCloudPush = true;
				}
				
				//validate
				var account = validateAndReturnRequiredAccount(params, reject);
				var realm = validateAndReturnRequiredRealm(params, reject);
				var token = validateAndReturnRequiredAccessToken(params, reject);
				
				var pushURL = (params.ssl ? 'https://' : 'http://') + services.pushURL + '/';

				if (ice && ice.push && ice.push.configuration.contextPath) {
					addPushGroupMember();
					console.log('bridgeit.io.push.addPushListener() added listener ' + 
						params.callback + ' to group ' + params.group);
					resolve();
				} else {
					reject('Push service is not active');
				}
			});
		},

		/**
		 * Remove listener for notifications belonging to the specified group.
	 	 * Callbacks must be passed by name to receive cloud push notifications.
		 *
		 * @alias addPushListener
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.group The push group name
		 */
		removePushListener: function(params){
			return new Promise(function(resolve, reject) {
				console.log('bridgeit.io.push.removePushListener() group: ' + params.group);
				params = params ? params : {};
				services.checkHost(params);	
				validateRequiredGroup(params, reject);
				var pushListenersStr = b.getSessionStorageItem(PUSH_CALLBACKS);
				if( !pushListenersStr ){
					console.error('Cannot remove push listener ' + params.group + ', missing push listener storage.');
				}
				else{
					try{
						var pushListenerStorage = JSON.parse(pushListenersStr);
						var listeners = pushListenerStorage[params.group];
						console.log('found push listeners in storage: ' + ( listeners ? JSON.stringify(listeners) : null ) );
						if( !listeners ){
							console.error('could not find listeners for group ' + params.group);
							return;
						}
						ice.push.connection.resumeConnection();
						var pushIds = [];
						for( var i = 0 ; i < listeners.length ; i++ ){
							ice.push.removeGroupMember(params.group, listeners[i].pushId);
							console.log('removed push id ' + listeners[i].pushId);
						}
						delete pushListenerStorage[params.group];
						b.setSessionStorageItem(PUSH_CALLBACKS, JSON.stringify(pushListenerStorage));

					}
					catch(e){
						console.error(e);
					}
				}
							
			});
		},

		/**
		 * Push notification to a push group.
		 *
		 * This will result in an Ajax Push (and associated callback)
		 * to any web pages that have added a push listener to the
		 * specified group.  If Cloud Push options are provided
		 * (params.subject and params.detail) a Cloud Push will
		 * be dispatched as a home screen notification to any devices
		 * unable to recieve the Ajax Push via the web page.
		 *
		 * @alias sendPushEvent
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.group The push group name
		 * @param {String} params.subject The subject heading for the notification
		 * @param {String} params.detail The message text to be sent in the notification body
		 */
		sendPushEvent: function(params) {
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);

					validateRequiredGroup(params, reject);
					
					var pushURL = (params.ssl ? 'https://' : 'http://') + services.pushURL + '/';
					
					/* TODO
					if (!absoluteGoBridgeItURL)  {
						if (!!bridgeit.goBridgeItURL)  {
							absoluteGoBridgeItURL = getAbsoluteURL(bridgeit.goBridgeItURL);
						}
					}
					if (!!absoluteGoBridgeItURL)  {
						if (options && !options.url)  {
							options.url = absoluteGoBridgeItURL;
						}
					}
					*/
					if (ice && ice.push && ice.push.configuration.contextPath) {
						var post = {};
						if( params.subject ){
							post.subject = params.subject;
						}
						if( params.detail ){
							post.detail = params.detail;
						}
						ice.push.notify(params.group, post);
						resolve();
					} else {
						reject('Push service is not active');
					}
				}
			);
		}
	};

	/* CONTEXT SERVICE */
	services.context = {

		getUser: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					var username = validateAndReturnRequiredUsername(params, reject);

					var url = getRealmResourceURL(services.contextURL, account, realm, 
						'users/' + username, token, params.ssl);

					b.$.getJSON(url).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve(response);
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		getUserState: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					var username = validateAndReturnRequiredUsername(params, reject);

					var url = getRealmResourceURL(services.contextURL, account, realm, 
						'users/' + username + '/state', token, params.ssl);

					b.$.getJSON(url).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve(response);
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		setUserState: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					validateRequiredState(params, reject);
					
					services.checkHost(params);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					var username = validateAndReturnRequiredUsername(params, reject);

					var url = getRealmResourceURL(services.contextURL, account, realm, 
						'users/' + username + '/state', token, params.ssl);

					b.$.post(url, params.state).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve(response);
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		getUserInfo: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					var username = validateAndReturnRequiredUsername(params, reject);

					var url = getRealmResourceURL(services.contextURL, account, realm, 
						'users/' + username + '/info', token, params.ssl);

					b.$.getJSON(url).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve(response);
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		getUpdates: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					var username = validateAndReturnRequiredUsername(params, reject);

					var url = getRealmResourceURL(services.contextURL, account, realm, 
						'users/' + username + '/updates', token, params.ssl);

					b.$.getJSON(url).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve(response);
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		getUnreadUpdates: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					var username = validateAndReturnRequiredUsername(params, reject);

					var url = getRealmResourceURL(services.contextURL, account, realm, 
						'users/' + username + '/updates/unread', token, params.ssl);

					b.$.getJSON(url).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve(response);
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		executeContext: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					validateRequiredData(params, reject);

					services.checkHost(params);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);

					var url = getRealmResourceURL(services.contextURL, account, realm, 
						'contexts/' + params.name, token, params.ssl, {
							op: 'exec'
						});

					b.$.post(url, params.data).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve(response);
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		}

	};

	/* CODE SERVICE */
	services.code = {

		/**
		 * Executes a code flow
		 *
		 * @alias executeFlow
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @param {String} params.httpMethod (default 'post') 'get' or 'post'
		 * @param {String} params.flow The code flow name
		 * @param {Object} params.data The data to send with the flow
		 */
		executeFlow: function(params){
			return new Promise(
				function(resolve, reject) {
					params = params ? params : {};
					services.checkHost(params);
					
					var httpMethod = params.httpMethod || 'post';
					httpMethod = httpMethod.toLowerCase();

					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					validateRequiredFlow(params, reject);

					var url = getRealmResourceURL(services.codeURL, account, realm, 
						'nodes/' + encodeURI(params.flow), token, params.ssl);

					if( 'get' === httpMethod ){
						//TODO encode params.data into URL?
						b.$.get(url).then(function(response){
							services.auth.updateLastActiveTimestamp();
							resolve();
						})['catch'](function(error){
							reject(error);
						});
					}
					else if( 'post' === httpMethod ){
						b.$.post(url, params.data).then(function(response){
							services.auth.updateLastActiveTimestamp();
							resolve();
						})['catch'](function(error){
							reject(error);
						});
					}
					
				}
			);
		},

		start: function(params){
			return new Promise(
				function(resolve, reject) {

					params = params ? params : {};
					services.checkHost(params);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					
					var url = getRealmResourceURL(services.codeURL, account, realm, 
						'', token, params.ssl);

					b.$.post(url).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve();
					})['catch'](function(error){
						reject(error);
					});
					
				}
			);
		},

		stop: function(params){
			return new Promise(
				function(resolve, reject) {

					params = params ? params : {};
					services.checkHost(params);
					
					//validate
					var account = validateAndReturnRequiredAccount(params, reject);
					var realm = validateAndReturnRequiredRealm(params, reject);
					var token = validateAndReturnRequiredAccessToken(params, reject);
					
					var url = getRealmResourceURL(services.codeURL, account, realm, 
						'', token, params.ssl);

					b.$.doDelete(url).then(function(response){
						services.auth.updateLastActiveTimestamp();
						resolve();
					})['catch'](function(error){
						reject(error);
					});
				}
			);
		},

		restart: function(params){
			return services.code.stop(params).then(function(){
				return services.code.start(params);
			});
		}
	}

	/* STORAGE SERVICE */
	services.storage = {

		/**
		 * Retrieve the storage meta info for the realm
		 *
		 * @alias getMetaInfo
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @param {String} params.scope (default 'self') 'all' or 'self', return meta information for blobs belonging to all users, or only those belonging to the current user
		 * @returns {Object} The results
		 */
		getMetaInfo: function(params){
			return new Promise(function(resolve, reject) {
				params = params ? params : {};
				services.checkHost(params);
				
				//validate
				var account = validateAndReturnRequiredAccount(params, reject);
				var realm = validateAndReturnRequiredRealm(params, reject);
				var token = validateAndReturnRequiredAccessToken(params, reject);

				var url = getRealmResourceURL(services.storageURL, account, realm, 
					'meta', token, params.ssl, params.scope ? {scope: params.scope} : null);


				b.$.getJSON(url).then(function(response){
					services.auth.updateLastActiveTimestamp();
					resolve(response.directory);
				})['catch'](function(error){
					reject(error);
				});
			});
		},

		/**
		 * Stores a blob
		 *
		 * @alias uploadBlob
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.id The blob id. If not provided, the service will return a new id
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Object} params.blob The Blob to store
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @param {Function} params.progressCallback The callback function to call on progress events. eg. function progressCallback(percentComplete, xhr){..}
		 * @returns {Object} The results
		 */
		uploadBlob: function(params){
			return new Promise(function(resolve, reject) {
				params = params ? params : {};
				services.checkHost(params);
				
				//validate
				var account = validateAndReturnRequiredAccount(params, reject);
				var realm = validateAndReturnRequiredRealm(params, reject);
				var token = validateAndReturnRequiredAccessToken(params, reject);
				validateRequiredBlob(params, reject);

				var formData = new FormData();
				formData.append('file', params.blob);

				var url = getRealmResourceURL(services.storageURL, account, realm, 
					'blobs' + (params.id ? '/' + params.id : ''), token, params.ssl);

				b.$.post(url, formData, null, true, null, params.progressCallback).then(function(response){
					services.auth.updateLastActiveTimestamp();
					resolve(response.location || response.uri);
				})['catch'](function(error){
					reject(error);
				});
			});
		},

		/**
		 * Stores a file 
		 *
		 * @alias uploadBlob
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.id The blob id. If not provided, the service will return a new id
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Object} params.file The Blob to store
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @param {Function} params.progressCallback The callback function to call on progress events. eg. function progressCallback(percentComplete, xhr){..}
		 * @param {Function} params.onabort The callback for the XMLHttpRequest onabort event
		 * @param {Function} params.onerror The callback for the XMLHttpRequest onerror event
		 * @returns {Object} The results
		 */
		uploadFile: function(params){
			return new Promise(function(resolve, reject) {
				params = params ? params : {};
				services.checkHost(params);
				
				//validate
				var account = validateAndReturnRequiredAccount(params, reject);
				var realm = validateAndReturnRequiredRealm(params, reject);
				var token = validateAndReturnRequiredAccessToken(params, reject);
				validateRequiredFile(params, reject);

				var url = getRealmResourceURL(services.storageURL, account, realm, 
					'blobs' + (params.id ? '/' + params.id : ''), token, params.ssl);
				var formData = new FormData();
				formData.append('file', params.file);

				b.$.post(url, formData, null, true, null, params.progressCallback, params.onabort, params.onerror).then(function(response){
					services.auth.updateLastActiveTimestamp();
					resolve(response.location || response.uri);
				})['catch'](function(error){
					reject(error);
				});
			});
		},

		/**
		 * Retrieves a blob file from the storage service
		 *
		 * @alias getBlob
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.id The blob id. 
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 * @returns {Object} The blob arraybuffer
		 */
		getBlob: function(params){
			return new Promise(function(resolve, reject) {
				params = params ? params : {};
				services.checkHost(params);
				
				//validate
				var account = validateAndReturnRequiredAccount(params, reject);
				var realm = validateAndReturnRequiredRealm(params, reject);
				var token = validateAndReturnRequiredAccessToken(params, reject);
				validateRequiredId(params, reject);

				var url = getRealmResourceURL(services.storageURL, account, realm, 
					'blobs/' + params.id, token, params.ssl);

				b.$.getBlob(url).then(function(response){
					services.auth.updateLastActiveTimestamp();
					resolve(response);
				})['catch'](function(error){
					reject(error);
				});
			});
		},

		/**
		 * Deletes a blob file from the storage service
		 *
		 * @alias deleteBlob
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.id The blob id. 
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
		 * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
		 */
		deleteBlob: function(params){
			return new Promise(function(resolve, reject) {
				params = params ? params : {};
				services.checkHost(params);
				
				//validate
				var account = validateAndReturnRequiredAccount(params, reject);
				var realm = validateAndReturnRequiredRealm(params, reject);
				var token = validateAndReturnRequiredAccessToken(params, reject);
				validateRequiredId(params, reject);

				var url = getRealmResourceURL(services.storageURL, account, realm, 
					'blobs/' + params.id, token, params.ssl);

				b.$.doDelete(url).then(function(response){
					services.auth.updateLastActiveTimestamp();
					resolve();
				})['catch'](function(error){
					reject(error);
				});
			});
		}
	};

    /* QUERY SERVICE */
    services.query = {

        /**
         * Create a new query
         *
         * @alias createQuery
         * @param {Object} params params
         * @param {String} params.id The query id. If not provided, the service will return a new id
         * @param {Object} params.query The query to be created
         * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
         * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
         * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
         * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIt host, or the default will be used. (optional)
         * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
         * @returns {String} The resource URI
         */
        createQuery: function(params){
            return new Promise(
                function(resolve, reject) {
                    params = params ? params : {};
                    services.checkHost(params);

                    //validate
                    var account = validateAndReturnRequiredAccount(params, reject);
                    var realm = validateAndReturnRequiredRealm(params, reject);
                    var token = validateAndReturnRequiredAccessToken(params, reject);

                    var url = getRealmResourceURL(services.queryURL, account, realm,
                        'queries/' + (params.id ? params.id : ''), token, params.ssl);

                    b.$.post(url, params.query).then(function(response){
                        services.auth.updateLastActiveTimestamp();
                        resolve(response.uri);
                    })['catch'](function(error){
                        reject(error);
                    });

                }
            );
        },

        /**
         * Update a query
         *
         * @alias updateQuery
         * @param {Object} params params
         * @param {String} params.id The query id, the query to be updated
         * @param {Object} params.query The query
         * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
         * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
         * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
         * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
         * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
         * @returns {String} The resource URI
         */
        updateQuery: function(params){
            return new Promise(
                function(resolve, reject) {
                    params = params ? params : {};
                    services.checkHost(params);

                    //validate
                    var account = validateAndReturnRequiredAccount(params, reject);
                    var realm = validateAndReturnRequiredRealm(params, reject);
                    var token = validateAndReturnRequiredAccessToken(params, reject);
                    validateRequiredId(params, reject);

                    var url = getRealmResourceURL(services.queryURL, account, realm,
                        'queries/' + params.id, token, params.ssl);

                    b.$.put(url, params.query).then(function(){
                        services.auth.updateLastActiveTimestamp();
                        resolve();
                    })['catch'](function(error){
                        reject(error);
                    });
                }
            );
        },

        /**
         * Fetch a query
         *
         * @alias getQuery
         * @param {Object} params params
         * @param {String} params.id The query id, the query to fetch
         * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
         * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
         * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
         * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
         * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
         * @returns {Object} The query
         */
        getQuery: function(params){
            return new Promise(
                function(resolve, reject) {
                    params = params ? params : {};
                    services.checkHost(params);

                    //validate
                    var account = validateAndReturnRequiredAccount(params, reject);
                    var realm = validateAndReturnRequiredRealm(params, reject);
                    var token = validateAndReturnRequiredAccessToken(params, reject);
                    validateRequiredId(params, reject);

                    var url = getRealmResourceURL(services.queryURL, account, realm,
                        'queries/' + params.id, token, params.ssl);

                    b.$.getJSON(url).then(function(query){
                        services.auth.updateLastActiveTimestamp();
						resolve(query);
                    })['catch'](function(error){
                        reject(error);
                    });
                }
            );
        },

        /**
         * Searches for queries in a realm based on a query
         *
         * @alias findQueries
         * @param {Object} params params
         * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
         * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
         * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
         * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
         * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
         * @param {Object} params.query A mongo query for the queries
         * @param {Object} params.fields Specify the inclusion or exclusion of fields to return in the result set
         * @param {Object} params.options Additional query options such as limit and sort
         * @returns {Object} The results
         */
        findQueries: function(params){
            return new Promise(
                function(resolve, reject) {

                    params = params ? params : {};
                    services.checkHost(params);

                    //validate
                    var account = validateAndReturnRequiredAccount(params, reject);
                    var realm = validateAndReturnRequiredRealm(params, reject);
                    var token = validateAndReturnRequiredAccessToken(params, reject);

                    var url = getRealmResourceURL(services.queryURL, account, realm,
                        'queries/', token, params.ssl, {
                            'query': params.query ? encodeURIComponent(JSON.stringify(params.query)) : {},
                            'fields': params.fields ? encodeURIComponent(JSON.stringify(params.fields)) : {},
                            'options': params.options ? encodeURIComponent(JSON.stringify(params.options)) : {}
                        });

                    b.$.getJSON(url).then(function(doc){
                        services.auth.updateLastActiveTimestamp();
                        resolve(doc);
                    })['catch'](function(response){
                        reject(response);
                    });

                }
            );
        },

        /**
         * Delete a query
         *
         * @alias deleteQuery
         * @param {Object} params params
         * @param {String} params.id The query id, the query to be deleted
         * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
         * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
         * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
         * @param {String} params.host The BridgeIt Services host url. If not supplied, the last used BridgeIT host, or the default will be used. (optional)
         * @param {Boolean} params.ssl (default false) Whether to use SSL for network traffic.
         */
        deleteQuery: function(params){
            return new Promise(
                function(resolve, reject) {
                    params = params ? params : {};
                    services.checkHost(params);

                    //validate
                    var account = validateAndReturnRequiredAccount(params, reject);
                    var realm = validateAndReturnRequiredRealm(params, reject);
                    var token = validateAndReturnRequiredAccessToken(params, reject);
                    validateRequiredId(params, reject);

                    var url = getRealmResourceURL(services.queryURL, account, realm,
                        'queries/' + params.id, token, params.ssl);

                    b.$.doDelete(url).then(function(response){
                        services.auth.updateLastActiveTimestamp();
                        resolve();
                    })['catch'](function(error){
                        reject(error);
                    });
                }
            );
        }

    };

	/* DEVICE SERVICE */
	services.device = {
		/**
		 * Start live reporting of a device
		 *
		 * @alias startDevice
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.macAddress The address of the device to start.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 */
		startDevice: function(params){
			return new Promise(function(resolve, reject) {
				params = params ? params : {};
				services.checkHost(params);

				//validate
				var account = validateAndReturnRequiredAccount(params, reject);
				var realm = validateAndReturnRequiredRealm(params, reject);
				var token = validateAndReturnRequiredAccessToken(params, reject);
				validateRequiredId(params, reject);

				var url = getRealmResourceURL(services.deviceURL, account, realm,
					params.macAddress+'/start', token, params.ssl);

				b.$.put(url, {}).then(function(){
					services.auth.updateLastActiveTimestamp();
					resolve();
				})['catch'](function(error){
					reject(error);
				});
			});
		},

		/**
		 * Stop live reporting of a device
		 *
		 * @alias stopDevice
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.macAddress The address of the device to stop.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 */
		stopDevice: function(params){
			return new Promise(function(resolve, reject) {
				params = params ? params : {};
				services.checkHost(params);

				//validate
				var account = validateAndReturnRequiredAccount(params, reject);
				var realm = validateAndReturnRequiredRealm(params, reject);
				var token = validateAndReturnRequiredAccessToken(params, reject);
				validateRequiredId(params, reject);

				var url = getRealmResourceURL(services.deviceURL, account, realm,
					params.macAddress+'/stop', token, params.ssl);

				b.$.put(url, {}).then(function(){
					services.auth.updateLastActiveTimestamp();
					resolve();
				})['catch'](function(error){
					reject(error);
				});
			});
		},

		/**
		 * Stop all device reporting
		 *
		 * @alias stopDevices
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 */
		stopDevices: function(params){
			return new Promise(function(resolve, reject) {
				params = params ? params : {};
				services.checkHost(params);

				//validate
				var account = validateAndReturnRequiredAccount(params, reject);
				var realm = validateAndReturnRequiredRealm(params, reject);
				var token = validateAndReturnRequiredAccessToken(params, reject);
				validateRequiredId(params, reject);

				var url = getRealmResourceURL(services.deviceURL, account, realm,'/stop', token, params.ssl);

				b.$.put(url, {}).then(function(){
					services.auth.updateLastActiveTimestamp();
					resolve();
				})['catch'](function(error){
					reject(error);
				});
			});
		},

		/**
		 * Get all devices reporting on realm/account
		 *
		 * @alias getRunningDevices
		 * @param {Object} params params
		 * @param {String} params.account BridgeIt Services account name. If not provided, the last known BridgeIt Account will be used.
		 * @param {String} params.realm The BridgeIt Services realm. If not provided, the last known BridgeIt Realm name will be used.
		 * @param {String} params.accessToken The BridgeIt authentication token. If not provided, the stored token from bridgeit.io.auth.connect() will be used
		 */
		getRunningDevices: function(params){
			return new Promise(function(resolve, reject) {
				params = params ? params : {};
				services.checkHost(params);

				//validate
				var account = validateAndReturnRequiredAccount(params, reject);
				var realm = validateAndReturnRequiredRealm(params, reject);
				var token = validateAndReturnRequiredAccessToken(params, reject);
				validateRequiredId(params, reject);

				var url = getRealmResourceURL(services.deviceURL, account, realm,'/running', token, params.ssl);

				b.$.getJSON(url).then(function(devices){
					services.auth.updateLastActiveTimestamp();
					resolve(devices);
				})['catch'](function(error){
					reject(error);
				});
			});
		}

	}

	/* Initialization */
	services.configureHosts();

	/* check connect settings */
	if( services.auth.isLoggedIn()){
		var connectSettings = services.auth.getConnectSettings();
		if( connectSettings ){
			//user is logged in and has connect settings, so reconnect
			services.auth.connect(connectSettings);
		}
	}
	
	

	
})(bridgeit);

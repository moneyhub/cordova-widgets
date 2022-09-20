/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


const CONFIG = {
    CLIENT_ID: "client-id",
    CLIENT_SECRET: "client-secret",
    PAYEE_ID: "payee-id",
    REDIRECT_URI: "redirect-uri",
}

function parseQuery(queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}


function handleDeepLink(data) {
    console.log("Deep Link", data)
    const {queryString, host} = data

    if (host === "callback") {
        const {code, state, id_token: idToken, error} = queryString ? parseQuery(queryString) : {}
        moneyhubCallback({code, state, idToken, error})
    }
}

function openLinkInBrowser(link) {
    cordova.InAppBrowser.open(link, '_system', 'location=yes');
}

function initialiseMoneyhubWidget() {

    window.moneyhub.init({
        elem: document.getElementById("app"),
        clientId: CONFIG.CLIENT_ID,
        clientSecret: CONFIG.CLIENT_SECRET,
        payeeId: CONFIG.PAYEE_ID,
        payeeRef: "Payee ref",
        payerRef: "Payer ref",
        startText: "We have partnered with Moneyhub to enable you to make payments via OpenBanking",
        amount: 100,
        type: "test",
        redirectUri: CONFIG.REDIRECT_URI,
        openUri: openLinkInBrowser,
      })
}

function moneyhubCallback({code, state, idToken, error}) {

    window.moneyhub.callback({
        elem: document.getElementById("app"),
        code,
        state,
        error,
        idToken,
        redirectUri: CONFIG.REDIRECT_URI,
    })
}

function onPause() {
    // Handle the pause event
}

function onResume() {
    // Handle the resume event
}

function onMenuKeyDown() {
    // Handle the menubutton event
    window.moneyhubCallback.goBack()
}

function onDeviceReady() {

    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
    document.addEventListener("menubutton", onMenuKeyDown, false);

    // @ts-ignore
    window.IonicDeeplink.onDeepLink(handleDeepLink)

    initialiseMoneyhubWidget()

    console.log('Device ready Running cordova-' + cordova.platformId + '@' + cordova.version);
}

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

// listen for uncaught cordova callback errors
window.addEventListener("cordovacallbackerror", function (event) {
    // event.error contains the original error object
});

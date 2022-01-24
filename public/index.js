"use strict";

(() => {

  let currentID = null;

  window.addEventListener("load", init);

  /**
   * initialize
   */
  function init() {
    id("send").addEventListener("click", attemptSubmit);
    id("getstr").addEventListener("click", getString);
  }

  /**
   * get a string from the API
   */
  function getString() {
    let uname = getUsername();

    if (!uname || uname === "") {
      showErr("invalid username!");
      return;
    }

    currentID = -1;
    setText("loading...");
    handleStringResponse(fetch(`/string?user=${uname}`));
  }

  /**
   * handle new string response
   * @param {Promise<Response>} respPromise the response promise
   */
  function handleStringResponse(respPromise) {
    respPromise
      .then(statusCheck)
      .then(resp => resp.json())
      .then(respObj => {
        currentID = respObj.id;
        setText(respObj.text);
      })
      .catch(e => {
        showErr("an error occurred: " + e);
      });
  }

  /**
   * get the username from the box
   * @returns {string | null} the value of the username box
   */
  function getUsername() {
    return id("username").value;
  }

  /**
   * set the prompt text
   * @param {string} t the text to set
   */
  function setText(t) {
    id("promptstr").textContent = "" + t;
  }

  /**
   * try to submit data to the api
   */
  function attemptSubmit() {
    let sent1 = id("s1-box").checked;
    let sent2 = id("s2-box").checked;
    let sent3 = id("s3-box").checked;

    let uname = getUsername();
    if (!uname || uname === "") {
      showErr("invalid username!");
      return;
    }

    if (!currentID || currentID === -1) {
      showErr("Error: cannot submit! try another string.");
      return;
    }

    let query = `/response?user=${uname}&strid=${currentID}`;
    query += `&sent1=${sent1}&sent2=${sent2}&sent3=${sent3}`;

    setText("loading...");
    handleStringResponse(fetch(query));
  }

  /**
   * show an error message
   * @param {string} err the error to show
   */
  function showErr(err) {
    let errbox = id("errtext");
    errbox.textContent = err;
    errbox.classList.remove("hidden");

    setTimeout(hideErr, 5000);
  }

  /**
   * hide the error message
   */
  function hideErr() {
    let errbox = id("errtext");
    errbox.classList.add("hidden");
  }

  /*  -------- helper functions --------  */

  /**
   * querySelector wrapper
   * @param {String} selector the css selector
   * @returns {HTMLElement} result
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * document.getElementById wrapper
   * @param {String} idstr the id
   * @returns {HTMLElement} resi;t
   */
  function id(idstr) {
    return document.getElementById(idstr);
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} res - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   *                    Promise result
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

})();

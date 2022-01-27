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
      .catch(errObj => {
        showErr("an error occurred: " + errObj);
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
   * @param {string} text the text to set
   */
  function setText(text) {
    id("promptstr").textContent = "" + text;
  }

  /**
   * try to submit data to the api
   */
  function attemptSubmit() {
    let sent1 = id("s1-box").checked;
    let sent2 = id("s2-box").checked;
    let sent3 = id("s3-box").checked;
    let sent4 = id("s4-box").checked;
    let sent5 = id("s5-box").checked;
    let sent6 = id("s6-box").checked;
    let sent7 = id("s7-box").checked;
    let sent8 = id("s8-box").checked;
    let sent9 = id("pos").checked;
    let sent10 = id("neg").checked;
    let sent11 = id("neu").checked;
    let bad = id("bad").checked;

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
    query += `&anger=${sent1}&fear=${sent2}&anticipation=${sent3}`;
    query += `&trust=${sent4}&surprise=${sent5}&sadness=${sent6}`;
    query += `&joy=${sent7}&disgust=${sent8}&positive=${sent9}`;
    query += `&negative=${sent10}&neutral=${sent11}&bad=${bad}`;

    reset();

    // console.log("fetching ", query);
    handleStringResponse(fetch(query));
  }

  /**
   * reset state while loading.
   */
  function reset() {
    currentID = -1;
    setText("loading...");
    id("s1-box").checked = false;
    id("s2-box").checked = false;
    id("s3-box").checked = false;
    id("s4-box").checked = false;
    id("s5-box").checked = false;
    id("s6-box").checked = false;
    id("s7-box").checked = false;
    id("s8-box").checked = false;
    id("pos").checked = false;
    id("neg").checked = false;
    id("neu").checked = true;
    id("bad").checked = false;
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

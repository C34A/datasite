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
    let anger = id("s1-box").checked;
    let fear = id("s2-box").checked;
    let surprise = id("s5-box").checked;
    let sadness = id("s6-box").checked;
    let joy = id("s7-box").checked;
    let disgust = id("s8-box").checked;
    let positive = id("pos").checked;
    let negative = id("neg").checked;
    let neutral = id("neu").checked;
    let ambiguous = id("amb").checked;
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
    query += `&anger=${anger}&fear=${fear}`;
    query += `&surprise=${surprise}&sadness=${sadness}`;
    query += `&joy=${joy}&disgust=${disgust}&positive=${positive}`;
    query += `&negative=${negative}&neutral=${neutral}&ambiguous=${ambiguous}&bad=${bad}`;

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

    id("s5-box").checked = false;
    id("s6-box").checked = false;
    id("s7-box").checked = false;
    id("s8-box").checked = false;
    id("pos").checked = false;
    id("neg").checked = false;
    id("neu").checked = true;
    id("amb").checked = false;
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

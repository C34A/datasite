"use strict";
/* eslint-disable max-lines-per-function */
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
    let admiration = id("s1-box").checked;
    let amusement = id("s2-box").checked;
    let approval = id("s5-box").checked;
    let caring = id("s6-box").checked;
    let desire = id("s9-box").checked;
    let excitement = id("s14-box").checked;
    let gratitude = id("s16-box").checked;
    let joy = id("s18-box").checked;
    let love = id("s19-box").checked;
    let optimism = id("s21-box").checked;
    let pride = id("s22-box").checked;
    let relief = id("s24-box").checked;
    let anger = id("s3-box").checked;
    let annoyance = id("s4-box").checked;
    let disappointment = id("s10-box").checked;
    let disapproval = id("s11-box").checked;
    let disgust = id("s12-box").checked;
    let embarrassment = id("s13-box").checked;
    let fear = id("s15-box").checked;
    let grief = id("s17-box").checked;
    let nervousness = id("s20-box").checked;
    let remorse = id("s25-box").checked;
    let sadness = id("s26-box").checked;
    let confusion = id("s7-box").checked;
    let curiosity = id("s8-box").checked;
    let realization = id("s23-box").checked;
    let surprise = id("s27-box").checked;
    let neutral = id("s28-box").checked;
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
    query += `&admiration=${admiration}&amusement=${amusement}&anger=${anger}`;
    query += `&annoyance=${annoyance}&approval=${approval}&caring=${caring}`;
    query += `&confusion=${confusion}&curiosity=${curiosity}&desire=${desire}`;
    query += `&disappointment=${disappointment}&disapproval=${disapproval}`;
    query += `&disgust=${disgust}&embarrassment=${embarrassment}`;
    query += `&excitement=${excitement}&fear=${fear}&gratitude=${gratitude}`;
    query += `&grief=${grief}&joy=${joy}&love=${love}&nervousness=${nervousness}`;
    query += `&optimism=${optimism}&pride=${pride}&realization=${realization}`;
    query += `&relief=${relief}&remorse=${remorse}&sadness=${sadness}`;
    query += `&surprise=${surprise}&neutral=${neutral}&bad_string=${bad}`;

    reset();

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
    id("s9-box").checked = false;
    id("s14-box").checked = false;
    id("s16-box").checked = false;
    id("s18-box").checked = false;
    id("s19-box").checked = false;
    id("s21-box").checked = false;
    id("s22-box").checked = false;
    id("s24-box").checked = false;
    id("s3-box").checked = false;
    id("s4-box").checked = false;
    id("s10-box").checked = false;
    id("s11-box").checked = false;
    id("s12-box").checked = false;
    id("s13-box").checked = false;
    id("s15-box").checked = false;
    id("s17-box").checked = false;
    id("s20-box").checked = false;
    id("s25-box").checked = false;
    id("s26-box").checked = false;
    id("s7-box").checked = false;
    id("s8-box").checked = false;
    id("s23-box").checked = false;
    id("s27-box").checked = false;
    id("s28-box").checked = false;
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

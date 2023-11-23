import React, { useEffect } from "react";
import Languages from "../Languages";

const Translate = () => {
  useEffect(() => {
    const fromText = document.querySelector(".from-text");
    const toText = document.querySelector(".to-text");
    const exchangeIcon = document.querySelector(".exchange-icon"); // Updated class name
    const selectTag = document.querySelectorAll("select");
    const icons = document.querySelectorAll(".row i");
    const translateBtn = document.querySelector(".translate-button"); // Updated class name

    selectTag.forEach((tag, id) => {
      for (let country_code in Languages) {
        let selected =
          id === 0
            ? country_code === "hi-IN"
              ? "selected"
              : ""
            : country_code === "en-GB"
            ? "selected"
            : "";
        let option = `<option class="${id === 0 ? 'from-language-select' : 'to-language-select'}" ${selected} value="${country_code}">${Languages[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
      }
    });

    exchangeIcon.addEventListener("click", () => {
      let tempText = fromText.value;
      let tempLang = selectTag[0].value;
      fromText.value = toText.value;
      toText.value = tempText;
      selectTag[0].value = selectTag[1].value;
      selectTag[1].value = tempLang;
    });

    fromText.addEventListener("keyup", () => {
      if (!fromText.value) {
        toText.value = "";
      }
    });

    translateBtn.addEventListener("click", () => {
      let text = fromText.value.trim();
      let translateFrom = selectTag[0].value;
      let translateTo = selectTag[1].value;
      if (!text) return;
      if(translateFrom === translateTo)
      {
        alert('Source and target languages are the same. Please select different languages.');
        return;
      }
      toText.setAttribute("placeholder", "Translating.....");
      let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
      fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
          toText.value = data.responseData.translatedText;
          data.matches.forEach((data) => {
            if (data.id === 0) {
              toText.value = data.translation;
            }
          });
        });
      toText.setAttribute("placeholder", "Translation");
    });

    icons.forEach((icon) => {
      icon.addEventListener("click", ({ target }) => {
        if (!fromText.value || !toText.value) return;
        if (target.classList.contains("fa-copy")) {
          if (target.id === "from") {
            navigator.clipboard.writeText(fromText.value);
          } else {
            navigator.clipboard.writeText(toText.value);
          }
        } else {
          let utterance;
          if (target.id === "from") {
            utterance = new SpeechSynthesisUtterance(fromText.value);
            utterance.lang = selectTag[0].value;
          } else {
            utterance = new SpeechSynthesisUtterance(toText.value);
            utterance.lang = selectTag[1].value;
          }
          speechSynthesis.speak(utterance);
        }
      });
    });
  }, []);

  return (
    <>
      <div className="container">
        <div className="wrapper">
          <div className="text-input">
            <textarea
              spellCheck="false"
              className="from-text"
              placeholder="Text"
            ></textarea>
            <textarea
              spellCheck="false"
              readOnly
              disabled
              className="to-text"
              placeholder="Translate"
            ></textarea>
          </div>
          <ul className="controls">
            <li className="row from">
              <div className="icons">
                <i id="from" className="fas fa-volume-up from-speak-icon"></i>
                <i id="from" className="fas fa-copy from-copy-icon"></i>
              </div>
              <select className="from-language-select"></select>
            </li>
            <li className="exchange">
              <i className="fas fa-exchange-alt exchange-icon"></i>
            </li>
            <li className="row to">
              <select className="to-language-select"></select>
              <div className="icons">
                <i id="to" className="fas fa-volume-up to-speak-icon"></i>
                <i id="to" className="fas fa-copy to-copy-icon"></i>
              </div>
            </li>
          </ul>
        </div>
        <button className="translate-button">Translate Text</button>
      </div>
    </>
  );
};

export default Translate;

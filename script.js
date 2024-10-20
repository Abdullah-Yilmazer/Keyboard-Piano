const notes = ["A0", "Bb0", "B0", "C1", "Db1", "D1", "Eb1", "E1", "F1", "Gb1",
  "G1", "Ab1", "A1", "Bb1", "B1", "C2", "Db2", "D2", "Eb2", "E2",
  "F2", "Gb2", "G2", "Ab2", "A2", "Bb2", "B2", "C3", "Db3", "D3",
  "Eb3", "E3", "F3", "Gb3", "G3", "Ab3", "A3", "Bb3", "B3", "C4",
  "Db4", "D4", "Eb4", "E4", "F4", "Gb4", "G4", "Ab4", "A4", "Bb4",
  "B4", "C5", "Db5", "D5", "Eb5", "E5", "F5", "Gb5", "G5", "Ab5", "A5",
  "Bb5", "B5", "C6", "Db6", "D6", "Eb6", "E6", "F6", "Gb6", "G6",
  "Ab6", "A6", "Bb6", "B6", "C7", "Db7", "D7", "Eb7", "E7", "F7",
  "Gb7", "G7", "Ab7", "A7", "Bb7", "B7", "C8"];

const keywordNotes = {
  "1": "C4",
  "2": "D4",
  "3": "E4",
  "4": "F4",
  "5": "G4",
  "6": "A4",
  "7": "B4",
  "8": "C5",
  "9": "D5",
  "0": "E5",
  "q": "Db4",
  "w": "Eb4",
  "e": "Gb4",
  "r": "Ab4",
  "t": "Bb4",
  "y": "Db5",
  "u": "Eb5",
  "ı": "Gb5",
  "o": "Ab5",
  "p": "Bb5",
  "ğ": "C4",
  "ü": "D4",
  "ş": "F4",
  "i": "G4",
  "ö": "A4",
  "a": "C5",
  "s": "D5",
  "d": "F5",
  "f": "G5",
  "g": "A5",
  "h": "C6",
  "j": "D6",
  "k": "F6",
  "l": "G6",
  "ş": "C3",
  "i": "D3",
  "z": "E3",
  "x": "F3",
  "c": "G3",
  "v": "A3",
  "b": "B3",
  "n": "C6",
  "m": "D6",
  "ö": "Eb6",
  "ç": "F6",
  "ğ": "G6",
  "ü": "A6",
  " ": "B6",
  "é": "Db6"
};

// Tuşları #piano'nun içine oluşturuyor
notes.forEach(e => {
  document.getElementById("piano").innerHTML += `<div class="${e[1] == "b" ? "black-key" : "white-key"} key" data-note="${e}">${e}</div>`;
});

// Basılı tutma kontrolü için değişken
let isKeyPressed = {};

// Aktif sesi saklamak için değişken
let activeAudio = null;

// Piyanonun ana fonksiyonu
function playSound(note) {
  const audio = new Audio(`notes/${note}.mp3`);
  audio.volume = 1.0; // Başlangıç ses seviyesi
  audio.play();

  activeAudio = audio; // Aktif sesi global değişkene kaydet

  // Ses sona erdiğinde durumu temizle
  audio.addEventListener('ended', () => {
    audio.pause();
    audio.currentTime = 0; // İleri sar
    activeAudio = null; // Aktif sesi sıfırla
  });
}

// Sesin giderek azalmasını sağlamak için bir fonksiyon
function fadeOut(audio) {
  let volume = 1.0; // Başlangıçta ses seviyesi 1
  const fadeOutInterval = setInterval(() => {
    volume -= 0.1; // Ses seviyesini her 10 ms'de 0.1 azalt
    if (volume <= 0) {
      volume = 0; // Ses sıfıra düşmemeli
      clearInterval(fadeOutInterval); // Fade out işlemi tamamlandığında intervali temizle
      audio.pause();
      audio.currentTime = 0; // İleri sar
      activeAudio = null; // Aktif sesi sıfırla
    }
    audio.volume = volume; // Ses seviyesini güncelle
  }, 50); // Her 10 ms'de bir güncelle
}

// Sayfa yüklendiğinde tuşlara click event listener ekle
window.addEventListener('load', () => {
  const keys = Array.from(document.querySelectorAll('.key'));
  keys.forEach(key => {
    key.addEventListener('mousedown', () => {
      const note = key.getAttribute('data-note');
      // Eğer tuş basılı değilse notayı çal
      if (!isKeyPressed[note]) {
        playSound(note);
        isKeyPressed[note] = true; // Tuşu basılı olarak işaretle
      }
    });
    key.addEventListener('mouseup', () => {
      const note = key.getAttribute('data-note');
      // Tuş bırakıldığında durumu sıfırla
      isKeyPressed[note] = false;

      // Ses bırakıldığında fadeOut fonksiyonunu çağır
      if (activeAudio) {
        fadeOut(activeAudio); // Fade out işlemi
      }
    });
  });
});

// Klavye tuşları için event listener
window.addEventListener("keydown", e => {
  const note = keywordNotes[e.key];
  if (note) {
    // Eğer tuş basılı değilse notayı çal
    if (!isKeyPressed[note]) {
      playSound(note);
      isKeyPressed[note] = true; // Tuşu basılı olarak işaretle
      // Tuş stil değişikliği
      const key = document.querySelector(`.key[data-note="${note}"]`);
      if (key) key.style.backgroundColor = "grey";
    }
  }
});

window.addEventListener("keyup", e => {
  const note = keywordNotes[e.key];
  if (note) {
    // Tuş bırakıldığında durumu sıfırla
    isKeyPressed[note] = false;
    const key = document.querySelector(`.key[data-note="${note}"]`);
    if (key) key.style.backgroundColor = note[1] == "b" ? "black" : "white";

    // Ses bırakıldığında fadeOut fonksiyonunu çağır
    if (activeAudio) {
      fadeOut(activeAudio); // Fade out işlemi
    }
  }
});

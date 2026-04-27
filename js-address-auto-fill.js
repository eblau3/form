const addressAutoFill = (addressGroupEl) => {
  const btnEl = addressGroupEl.querySelector('.js-form-search-btn');
  const zipcodeEl = addressGroupEl.querySelector('.js-form-zipcode');
  if (!btnEl || !zipcodeEl) return;

  // 検索処理本体（使い回せるように関数化）
  const executeSearch = async () => {
    let zipcode = zipcodeEl.value;

    // 全角数字を半角に変換 + ハイフン除去
    zipcode = zipcode.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
                    .replace(/[-ー－]/g, '');

    if (zipcode.length !== 7) {
      alert('郵便番号を7桁で入力してください。');
      return;
    }

    const url = `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`;

    const response = await fetch(url);
    if (!response.ok) return;

    const data = await response.json();

    if (data.status === 200 && data.results) {
      const res = data.results[0];
      
      const prefEl = addressGroupEl.querySelector('.js-form-pref');
      const cityEl = addressGroupEl.querySelector('.js-form-city');
      const townEl = addressGroupEl.querySelector('.js-form-town');
      const extraEl = addressGroupEl.querySelector('.js-form-address-extra');

      if (prefEl) prefEl.value = res.address1;
      if (cityEl) cityEl.value = res.address2;
      if (townEl) townEl.value = res.address3;
      if (extraEl) extraEl.focus();
      
    } else {
      alert('該当する住所が見つかりませんでした。');
    }
  };

  btnEl.addEventListener('click', (e) => {
    e.preventDefault(); //念のためボタン本来の挙動を殺す
    executeSearch();
  });

  // Enterキーで実行
  zipcodeEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // フォーム送信の挙動を殺す
      executeSearch();
    }
  });
};

window.addEventListener('DOMContentLoaded', () => {
  const addressGroupEls = document.querySelectorAll('.js-form-address-group');
  
  if (addressGroupEls.length > 0) {
    addressGroupEls.forEach((addressGroupEl) => {
      addressAutoFill(addressGroupEl);
    });
  }
});
import React, { useState } from 'react';
import clipboardCopy from 'clipboard-copy';
import { toast } from 'react-toastify';

const DownloadImagesApp = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [adDetails, setAdDetails] = useState([])
  const [adDetails2, setAdDetails2] = useState([])
  const [error, setError] = useState(null);

  const handleJsonInputChange = (event) => {
    setJsonInput(event.target.value);
    setError(null);
  };

  const handleDownloadClick = async () => {
    try {
      const data = JSON.parse(jsonInput);

      if (!data || !data.images || !data.images.length) {
        throw new Error('Отсутствуют изображения в JSON.');
      }

      const imagesData = data.images.map((imageData) => imageData.original_url);

      for (let i = 0; i < imagesData.length; i++) {
        const imageUrl = imagesData[i];
        const imageName = `image_${i + 1}.jpeg`;

        try {
          const success = await downloadImage(imageUrl, imageName);
          if (!success) {
            throw new Error(`Не удалось скачать изображение ${imageName}.`);
          }
        } catch (error) {
          throw new Error(`Ошибка при скачивании изображения ${imageName}: ${error.message}`);
        }
      }
      toast.success("Фотографии установлены");
    } catch (error) {
      setError(`Ошибка при обработке JSON: ${error.message}`);
      toast.error("Произошла непредвиденная ошибка");
      console.error('Ошибка при обработке JSON:', error);
    }
  };

  const downloadImage = async (url, destFileName) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Неудачный запрос для ${url}.`);
      }

      const blob = await response.blob();
      const urlObject = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = urlObject;
      link.download = destFileName;
      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(urlObject);

      return true;
    } catch (error) {
      return false;
    }
  };

  const handleClearClick = () => {
    setJsonInput('');
    setError(null);
    setAdDetails([])
    setAdDetails2([])
  };

  function handleAdDetailsClick() {
    const data = JSON.parse(jsonInput);

    const {
        params,
        price,
        username,
        mobile,
        category_id,
        city,
        images
    } = data

    const roomParam = params.find(param => param.name === "Количество комнат");
    const floorParam = params.find(param => param.name === "Этаж");
    const allFloorParam = params.find(param => param.name === "Количество этажей");
    const seriesParam = params.find(param => param.name === "Серия");
    const furnitureParam = params.find(param => param.name === "Мебель");
    const rayon = params.find(param => param.name === "Район");
    const priceSymbol = data.symbol || "$";

    const formattedText = `
        Серия - ${seriesParam ? seriesParam.value : 'N/A'}
        Комнат - ${roomParam ? roomParam.value : 'N/A'}
        Этаж - ${floorParam ? floorParam.value : 'N/A'}/${allFloorParam ? allFloorParam.value : "N/A"}
        Район - ${rayon ? rayon.value : 'N/A'}
        ${furnitureParam ? furnitureParam.value : 'N/A'}

        Стоимость - ${price}${priceSymbol}
        Телефон - 0999609000
    `;

    const adDetailsDraft = []
    const adDetailsDraft2 = []

    if (seriesParam) {
        adDetailsDraft.push(`Серия - ${seriesParam.value}`)
        adDetailsDraft2.push(`Серия - ${seriesParam.value}`)
    }
    if (roomParam) {
        adDetailsDraft.push(`Комнат - ${roomParam.value}`)
        adDetailsDraft2.push(`Комнат - ${roomParam.value}`)
    }
    if (floorParam) {
        if(allFloorParam) {
            adDetailsDraft.push(`Этаж - ${floorParam.value}/${allFloorParam.value}`)
            adDetailsDraft2.push(`Этаж - ${floorParam.value}/${allFloorParam.value}`)
        } else {
            adDetailsDraft.push(`Этаж - ${floorParam.value}/?`)
            adDetailsDraft2.push(`Этаж - ${floorParam.value}/?`)
        }
    } else if(allFloorParam) {
        adDetailsDraft.push(`Этаж - ?/${allFloorParam.value}`)
        adDetailsDraft2.push(`Этаж - ?/${allFloorParam.value}`)
    }

    if (rayon) {
        adDetailsDraft.push(`Район - ${rayon.value}`)
        adDetailsDraft2.push(`Район - ${rayon.value}`)
    }
    if(furnitureParam) {
        adDetailsDraft.push(furnitureParam.value)
        adDetailsDraft2.push(furnitureParam.value)
    }

    adDetailsDraft.push(`Стоимость - ${price}${priceSymbol}`)
    adDetailsDraft2.push(`Стоимость - ${price}${priceSymbol}`)
    adDetailsDraft.push(`Телефон - 0999609000`)
    adDetailsDraft2.push(`Телефон - ${mobile}`)

    setAdDetails(adDetailsDraft)
    setAdDetails2(adDetailsDraft2)
}

const handleCopyClick = (order) => {
    const formattedDetails = adDetails.join('\n\n');
    const formattedDetails2 = adDetails2.join('\n\n');

    if(order === 1) {
        clipboardCopy(formattedDetails);
    } else {
        clipboardCopy(formattedDetails2);
    }

    toast.success('Детали скопированы в буфер обмена!');
  };

  return (
    <div>
      <h1>Приложение для загрузки изображений и получения деталей</h1>
      <textarea
        rows="5"
        cols="50"
        placeholder="Вставьте JSON с LALAFO..."
        value={jsonInput}
        onChange={handleJsonInputChange}
      />
      <div>
        <button onClick={handleDownloadClick}>Скачать изображения</button>
        <button onClick={handleAdDetailsClick}>Показать детали объявления</button>
        <button onClick={handleClearClick}>Очистить</button>
      </div>
      <div
        style={{
            display: "flex",
            justifyContent: "space-around"
        }}
      >
        <div>
            {adDetails.length ? <>
                <h2>Для общей группы</h2>
                {adDetails.map((adDetail) => {
                    return <React.Fragment key={adDetail}>
                        <div>
                            {adDetail}
                        </div>
                        <br />
                    </React.Fragment>
                })}
                <button onClick={() => handleCopyClick(1)}>Скопировать</button>
            </> : null}
        </div>
        <div>
            {adDetails2.length ? <>
                <h2>Для приватной группы</h2>
                {adDetails2.map((adDetail, idx) => {
                    return <React.Fragment key={idx}>
                        <div>
                            {adDetail}
                        </div>
                        <br />
                    </React.Fragment>
                })}
                <button onClick={() => handleCopyClick(2)}>Скопировать</button>
            </> : null}
        </div>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default DownloadImagesApp;

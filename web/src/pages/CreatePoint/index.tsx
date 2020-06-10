import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import { LeafletMouseEvent } from 'leaflet';
import { Map, TileLayer, Marker } from 'react-leaflet';
import * as yup from 'yup';

import Dropzone from '../../components/Dropzone';
import api from '../../services/api';
import ibge from '../../services/ibge-api';

import './styles.css';

import logo from '../../assets/logo.png';

interface Item {
  id: number;
  title: string;
  imageUrl: string;
}
interface IBGEUFResponse {
  id: number;
  sigla: string;
  nome: string;
}

interface IBGECityResponse {
  id: number;
  nome: string;
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [citys, setCitys] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [formData, setFormaData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  });
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0 , 0]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0 , 0]);
  const [selectedFile, setSelectedFile] = useState<File>();

  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude]);
    })
  }, []);

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data);
    })
  }, []);

  useEffect(() => {
    ibge.get<IBGEUFResponse[]>('').then(response => {
      const initials = response.data.map(item => item.sigla);
      setUfs(initials);
    });
  }, []);

  useEffect(() => {
    if ( selectedUf === '0') return;
    ibge.get<IBGECityResponse[]>(`${selectedUf}/municipios`).then(response => {
      const citys = response.data.map(item => item.nome);
      setCitys(citys);
    });
  }, [selectedUf]);

  const handleSelectUf = (event: ChangeEvent<HTMLSelectElement>) => {
    const uf = event.target.value;
    setSelectedUf(uf);
  }

  const handleSelectedCity = (event: ChangeEvent<HTMLSelectElement>) => {
    const city = event.target.value;
    setSelectedCity(city);
  }

  const handleMapClick = (event: LeafletMouseEvent) => {
    setSelectedPosition([
      event.latlng.lat,
      event.latlng.lng,
    ])
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormaData({
      ...formData,
      [name]: value,
    })
  }

  const handleSelectItem = (id: number) => {
    const alreadySelected = selectedItems.findIndex(item => item === id);

    if (alreadySelected < 0 ) {
      setSelectedItems([
        ...selectedItems,
        id
      ]);
    } else {
      const filteredItems = selectedItems.filter(item => item !== id);
      setSelectedItems(filteredItems);
    }

  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const { name, email, whatsapp } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [ latitude, longitude ] = selectedPosition
    const items = selectedItems;
    const inputs = {
      name,
      email,
      whatsapp,
      uf,
      city,
      latitude,
      longitude,
      items,
    };
    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email(),
      whatsapp: yup.number().required(),
      latitude: yup.number().required(),
      longitude: yup.number().required(),
      city: yup.string().required(),
      uf: yup.string().required().max(2),
      items: yup.array().min(1).required(),
    });
    const valid = await schema.isValid(inputs);

    if (valid && selectedFile) {
      const data = new FormData();
      data.append('name', name);
      data.append('email', email);
      data.append('whatsapp', whatsapp);
      data.append('uf', uf);
      data.append('city', city);
      data.append('latitude', String(latitude));
      data.append('longitude', String(longitude));
      data.append('items', items.join(','));
      data.append('image', selectedFile);

      await api.post('points', data);
  
      alert('Ponto de coleta criado');
      history.push('/');
    } else {
      alert('Erro ao criar ponto de coleta, verifique se todos os campos foram inseridos.');
    }


  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt='Detector de Sexismo'/>
        <Link to='/'>
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>
      <form onSubmit={handleSubmit}>
        <h1>Cadastro do <br/>ponto de coleta</h1>
        <Dropzone onFileUploaded={setSelectedFile}/>
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name"> Nome da entidade</label>
            <input
              type='text'
              name='name'
              id='name'
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email"> E-mail</label>
              <input
                type='text'
                name='email'
                id='email'
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp"> Whatsapp</label>
              <input
                type='text'
                name='whatsapp'
                id='whatsapp'
                value={formData.whatsapp}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>
          <Map
            center={initialPosition}
            zoom={15}
            onClick={handleMapClick}
          >
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            <Marker position={selectedPosition} />
          </Map>
          <div className='field-group'>
            <div className='field'>
              <label htmlFor='uf'> Estado (UF)</label>
              <select
                name='uf'
                id='uf'
                value={selectedUf}
                onChange={handleSelectUf}
              >
                <option value={'0'}>Selecione uma UF...</option>
                { ufs.map( uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
            <div className='field'>
              <label htmlFor='city'> Cidade</label>
              <select
                name='city'
                id='city'
                value={selectedCity}
                onChange={handleSelectedCity}
              >
                <option value='0'>Selecione uma cidade..</option>
                { citys.map( city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>
          <ul className='items-grid'>
            {items.map(item => (
              <li
               key={item.id}
               onClick={() => handleSelectItem(item.id)}
               className={selectedItems.includes(item.id) ? 'selected' : ''}
              >
                <img src={item.imageUrl} alt={item.title}/>
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>
        <button type='submit'>
          Cadastrar ponto de coleta
        </button>
      </form>
    </div>
  )
}

export default CreatePoint;

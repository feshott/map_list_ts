import React, { Component } from 'react';
import { observer } from 'mobx-react'
import { action } from 'mobx'
import store from '../../Store/Store'
import { YMaps, Map, Placemark, Button } from 'react-yandex-maps';
import './HomeMap.css';


@observer
export default class HomeMap extends Component {

  setNumHome = (coordinates) => {
    const checkList = store.checkList
    const currPosition = coordinates.join(',')
    let numHome = ''

    checkList.forEach((element, index) => {
      if (element.position.join(',') === currPosition) {
        numHome = index + 1
      }
    });

    return numHome
  }

  colorHome = (zone) => {
    const colorHomeList = {
      'CЭ-1': 'islands#redCircleIcon',
      'CЭ-95': 'islands#nightCircleIcon'
    }
    return colorHomeList[zone]
  }

  @action
  removeRouterList = () => {
    store.routeList = []
  }

  @action
  setRouterList = () => {
    const checkList = store.checkList
    const routeList = checkList.map(home => {
      return { type: 'wayPoint', point: home.position }
    })
    store.routeList = routeList
  }

  onApiAvaliable(ymaps) {
    ymaps.route(store.routeList, {
      multiRoute: true,
      routingMode: "pedestrian"
    }).done(function (route) {
      route.options.set("mapStateAutoApply", true);
      this.map.geoObjects.add(route);
    }, function (err) {
      throw err;
    }, this);
  }

  @action
  searchAddress = (e) => {
    e.preventDefault()
    const address = this.search.value
    const searchList = store.homeList.filter(home => home.address.indexOf(address) !== -1)
    store.searchList = searchList
    this.search.value = ''
  }

  @action
  reloadSearchAddress = (e) => {
    e.preventDefault()
    store.searchList = []
  }

  render() {
    const { routeList, searchList, homeList } = store
    const { changeCheckList } = this.props
    const startPosition = { center: [55.7245, 37.561], zoom: 16 };
    return (
      <div className="home_map">
        <YMaps key={routeList.length} onApiAvaliable={(ymaps) => this.onApiAvaliable(ymaps)}>
          <Map
            width={550}
            height={400}
            state={startPosition}
            instanceRef={(ref) => this.map = ref} >

            {(searchList.length === 0 ? homeList : searchList).map((home, index) => {
              return (
                <Placemark
                  key={index}
                  properties={{
                    hintContent: home.zone.name,
                    iconContent: this.setNumHome(home.position)
                  }}
                  geometry={{
                    coordinates: home.position
                  }}
                  options={{
                    preset: this.colorHome(home.zone.name)
                  }}
                  onClick={changeCheckList}
                />
              )
            })}

            <Button
              data={{
                content: "Сбросить маршрут",
              }}
              options={{
                maxWidth: [200],
                selectOnClick: false
              }}
              onClick={this.removeRouterList}
            />

            <Button
              data={{
                content: "Проложить маршрут",
              }}
              options={{
                maxWidth: [200],
                selectOnClick: false
              }}
              onClick={this.setRouterList}
            />
          </Map>
        </YMaps>
        <form>
          <input ref={input => this.search = input}
            type="text"
            placeholder="Введите адрес" />
          <button onClick={this.searchAddress}>Найти</button>
          <button onClick={this.reloadSearchAddress}>Сбросить фильтр</button>
        </form>
      </div>
    );
  }
}
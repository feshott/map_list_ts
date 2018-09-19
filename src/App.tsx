import { action } from 'mobx'
import { observer } from 'mobx-react'
import HomeMap from './components/HomeMap/HomeMap'
import { RoadList } from './containers/RoadList/RoadList'
import store from './Store/Store'

import * as React from 'react';
import './App.css';

(window as any).store = store


@observer
class App extends React.Component<any, any> {

  @action
  public changeCheckList = (event: any) => {
    const homeList = store.homeList
    const checkList = store.checkList
    const checkHomeNum = event.originalEvent.target.properties._data.iconContent
    const checkHomeCoordinates = event.originalEvent.target.geometry._coordinates

    if (checkHomeNum) {
      const newCheckList = checkList.slice(0, checkHomeNum - 1).concat(checkList.slice(checkHomeNum))
      store.checkList = newCheckList
    }
    else {
      homeList.forEach((home, index) => {
        if (home.position.join(', ') === checkHomeCoordinates.join(', ')) {
          const newCheckList = [...checkList, homeList[index]]
          store.checkList = newCheckList
        }
      })
    }
  }


  public render() {
    const { checkList } = store
    return (
      <div className="App">
        <HomeMap
          changeCheckList={this.changeCheckList} />
        <RoadList
          checkList={checkList} />
      </div>

    );
  }
}

export default App;

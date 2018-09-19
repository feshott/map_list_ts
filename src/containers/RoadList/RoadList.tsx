import { observer } from 'mobx-react'
import * as React from 'react';
import { ItemList } from '../ItemList/ItemList'
import './RoadList.css';


export const RoadList = observer(({ checkList }: any) =>
  <div className="road_list">
    <h1 className="title">Маршрут проверки</h1>
    {checkList.map((home: any, index: any) =>
      <ItemList checkHomeInfo={home} key={index} />
    )}
  </div>)

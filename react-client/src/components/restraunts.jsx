import React from 'react';
const styles = {
  image: {
    witdh: '13px'
  }
}

const Restaurants = (props) => {
  console.log(props.restaurant);
  return (
    <table>
      <tbody>
        <tr>
          <th> Restraunt Name </th>
          <th> Avg Cost for Two </th>
        </tr>
        {props.restaurant.map((e, index) =>
          <tr key={index}>
            <td><img onClick={() => props.addEventToTrip(event,props.user,props.city)} style={styles.image} src={'http://www.clker.com/cliparts/f/e/5/e/11954452971071026229jean_victor_balin_add.svg.med.png'}/><a href={e.restaurant.url}>  {e.restaurant.name}</a> </td>
            <td>${e.restaurant.average_cost_for_two}</td>
          </tr>
        )}
      </tbody>
      </table>
  )
}

export default Restaurants

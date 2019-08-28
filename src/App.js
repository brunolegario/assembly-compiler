import React from 'react';

import './css/app.scss';



export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        }
    }



    render() {
        return (
            <main className='main'>
                <aside style={{ width: '25%' }}>teste2</aside>
                <section style={{ width: '75%' }}>teste</section>
            </main>
        );
    }
}

import './style.css';

import React, { Fragment } from "react";

import Utils from '../../Utils';

interface card {
    _id: string,
    name: string,
    src: string
}
interface AppState {
    clickedCards: card[];
    data: any
}

interface movingCard {
    moves: number;
    misses: number;
    points: number
}

interface myProps {
    grid: number
}

class Dashboard extends React.Component<myProps, AppState> {
    private movingDetails: movingCard;

    constructor(props: any) {
        super(props);
        this.state = {
            clickedCards: [],
            data: []
        }
        this.movingDetails = { moves: 0, misses: 0, points: 0 };
    }

    componentDidMount(): void {
        const { grid } = this.props;
        const data = Utils.getDynamicGrid(grid);
        this.setState({ data: data })
    }

    setClickedCards = (cardDetails: any) => {
        const { clickedCards, data } = this.state;
        if (clickedCards.length && cardDetails) {
            this.movingDetails = { misses: this.movingDetails.misses, moves: this.movingDetails.moves + 1, points: this.movingDetails.points }
        }
        this.setState((prevState: any) => ({
            clickedCards: [...prevState.clickedCards, cardDetails]
        }), () => {
            setTimeout(() => {
                if (clickedCards && clickedCards[0] && clickedCards[0].src !== cardDetails.src) {
                    this.movingDetails = { misses: this.movingDetails.misses + 1, moves: this.movingDetails.moves, points: this.movingDetails.points }
                    this.setState({ clickedCards: [] })
                }
                if (clickedCards && clickedCards[0] && clickedCards[0].src === cardDetails.src) {
                    this.movingDetails = { misses: this.movingDetails.misses, moves: this.movingDetails.moves, points: this.movingDetails.points + 1 }
                    const updatedData = data.map((row: any) =>
                    (row.map((card: any) => {
                        return card.src === cardDetails.src ? { ...card, src: 'none' } : card
                    }))
                    );
                    this.setState({ data: updatedData })
                }
            }, 300);
        });
    }

    isIncludedCard = (card_id: string) => {
        console.log(card_id);
        const { clickedCards } = this.state;
        if (!clickedCards || !clickedCards.length) {
            return false;
        }
        for (let card of clickedCards) {
            if (card._id === card_id) {
                return true;
            }
        }
    }

    isMatchOver = () => {
        const { data } = this.state;
        let filteredData: card[] = [];
        data.map((row: any) => {
            filteredData = (row.filter((cell: any) => cell.src !== 'none'))
            filteredData.push(...filteredData);
        });
        if (!filteredData.length) {
            return true;
        }
        return false;
    }
    render() {
        const { data } = this.state;
        if (this.isMatchOver()) {
            return (
                <div className='wrapper'>
                    <div className='completed_text'>You have completed !!!</div>
                </div>)
        }
        return (
            <div className='wrapper'>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${6}, 100px)`, gap: '1rem' }}>
                    {data.map((row: any, rowIndex: any) => (
                        <Fragment key={rowIndex}>
                            {row.map((cell: any, colIndex: any) => (
                                (cell.src === 'none') ? <div key={colIndex} className='game_card_layout'></div> :
                                    <div
                                        key={colIndex}
                                        className='game_card_layout game_card_layout_bg'
                                        onClick={(e) => { this.setClickedCards(cell) }}
                                    >
                                        {this.isIncludedCard(cell._id) ? <img width={"100%"} height={"100%"} src={cell.src} /> : ''}
                                    </div>
                            ))}
                        </Fragment>
                    ))}
                </div>
                <div className='details_wrapper'>
                    <div className='align_details'>Moves <span>{this.movingDetails.moves}</span></div>
                    <div className='align_details'>Misses <span>{this.movingDetails.misses}</span></div>
                    <div className='align_details'>Points <span>{this.movingDetails.points}</span></div>
                </div>
            </div>
        )
    }
}


export default Dashboard;
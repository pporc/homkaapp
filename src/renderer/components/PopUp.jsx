import React, {useRef, useEffect} from 'react'

export default function PopUp(props) {   

    return (
        <div className={props.tab ? 'card' : 'card text-white bg-danger'} style={popUpStyle.container}>
            <span style={popUpStyle.span} onClick={() => props.close()}>&times;</span>
            {props.children}
        </div>
    )
}

const popUpStyle = {
	container: {
		display: 'relative',
		position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        border: '1px solid black',
    },
    span: {
        position: 'absolute',
        right: '4px',
        cursor: 'pointer',
        fontSize: '1.5em',
        top: '-10px'
    }
}
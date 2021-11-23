import React, { Component } from 'react'
import { ThemeProvider } from '@material-ui/core/styles'
import { createTheme } from '@material-ui/core/styles'
import { ipcRenderer } from 'electron'
import CSS from 'csstype'
import Button from 'react-bootstrap/Button'
import {
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalBody,
    MDBModalFooter,
    MDBInput,
} from 'mdb-react-ui-kit'

import Accelerometer from './Accelerometer'
import Laps from './Laps'
import Tires from './Tires'
import Steering from './Steering'
import Map from './Map'
import Tach from './Tach'

const darkTheme = createTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#FA6868',
        },
        secondary: {
            main: '#0BEA99',
        },
    },
})

const sideColumnStyle: CSS.Properties = {
    float: 'left',
    width: '25%',
    height: '95vh',
}
const centerColumnStyle: CSS.Properties = {
    float: 'left',
    width: '50%',
    height: '95vh',
}
const accelerometerContainerStyle: CSS.Properties = {
    backgroundColor: '#171717',
    height: '33.33%',
    margin: '15px',
    borderRadius: '5px',
}
const lapContainerStyle: CSS.Properties = {
    backgroundColor: '#171717',
    height: '66.66%',
    margin: '15px',
    borderRadius: '5px',
}
const basicTelemetryContainerStyle: CSS.Properties = {
    backgroundColor: '#171717',
    height: '32.75%',
    margin: '15px',
    borderRadius: '5px',
}
const mainHudContainerStyle: CSS.Properties = {
    height: '100%',
    fontFamily: 'Roboto',
    fontWeight: 'normal',
}
const mainHudTopStyle: CSS.Properties = {
    height: '10%',
    marginTop: '15px',
    borderRadius: '5px',
}
const mainHudBottomStyle: CSS.Properties = {
    height: '10%',
    borderRadius: '5px',
    marginTop: '60px',
}
const dataValueStyle = {
    color: '#C54242',
    fontSize: '24px',
}
const dataKeyStyle = {
    color: 'grey',
    fontSize: '12px',
}

// type Packet = {
//     TimestampMS: number

//     EngineMaxRpm: number
//     EngineIdleRpm: number
//     CurrentEngineRpm: number

//     AccelerationX: number
//     AccelerationY: number
//     AccelerationZ: number

//     VelocityX: number
//     VelocityY: number
//     VelocityZ: number

//     AngularVelocityX: number
//     AngularVelocityY: number
//     AngularVelocityZ: number

//     Yaw: number
//     Pitch: number
//     Roll: number

//     NormalizedSuspensionTravelFrontLeft: number
//     NormalizedSuspensionTravelFrontRight: number
//     NormalizedSuspensionTravelRearLeft: number
//     NormalizedSuspensionTravelRearRight: number

//     TireSlipRatioFrontLeft: number
//     TireSlipRatioFrontRight: number
//     TireSlipRatioRearLeft: number
//     TireSlipRatioRearRight: number

//     WheelRotationSpeedFrontLeft: number
//     WheelRotationSpeedFrontRight: number
//     WheelRotationSpeedRearLeft: number
//     WheelRotationSpeedRearRight: number

//     WheelOnRumbleStripFrontLeft: number
//     WheelOnRumbleStripFrontRight: number
//     WheelOnRumbleStripRearLeft: number
//     WheelOnRumbleStripRearRight: number

//     WheelInPuddleDepthFrontLeft: number
//     WheelInPuddleDepthFrontRight: number
//     WheelInPuddleDepthRearLeft: number
//     WheelInPuddleDepthRearRight: number

//     SurfaceRumbleFrontLeft: number
//     SurfaceRumbleFrontRight: number
//     SurfaceRumbleRearLeft: number
//     SurfaceRumbleRearRight: number

//     TireSlipAngleFrontLeft: number
//     TireSlipAngleFrontRight: number
//     TireSlipAngleRearLeft: number
//     TireSlipAngleRearRight: number

//     TireCombinedSlipFrontLeft: number
//     TireCombinedSlipFrontRight: number
//     TireCombinedSlipRearLeft: number
//     TireCombinedSlipRearRight: number

//     SuspensionTravelMetersFrontLeft: number
//     SuspensionTravelMetersFrontRight: number
//     SuspensionTravelMetersRearLeft: number
//     SuspensionTravelMetersRearRight: number

//     CarOrdinal: number
//     CarClass: number
//     CarPerformanceIndex: number
//     DrivetrainType: number
//     NumCylinders: number

//     IsRaceOn: number
//     PositionX: number
//     PositionY: number
//     PositionZ: number
//     Speed: number
//     Power: number
//     Torque: number
//     TireTempFl: number
//     TireTempFr: number
//     TireTempRl: number
//     TireTempRr: number
//     Boost: number
//     Fuel: number
//     Distance: number
//     BestLapTime: number
//     LastLapTime: number
//     CurrentLapTime: number
//     CurrentRaceTime: number
//     Lap: number
//     RacePosition: number
//     Accelerator: number
//     Brake: number
//     Clutch: number
//     Handbrake: number
//     Gear: number
//     Steer: number
//     NormalDrivingLine: number
//     NormalAiBrakeDifference: number
// }

let dataCount = 0

function secondsToTimeString(seconds: number) {
    const s = Math.floor(seconds % 60)
    const m = Math.floor(((seconds * 1000) / (1000 * 60)) % 60)
    let strFormat = 'MM:SS'

    strFormat = strFormat.replace(/MM/, m + '')
    strFormat = strFormat.replace(/SS/, s + '')

    return strFormat
}

// const [data, setData] = useState<Packet>()
// const [recordingState, setRecordingState] = useState('Record')
// const [lapCoords, setLapCoords] = useState([])
// const [prevLapCoords, setPrevLapCoords] = useState([])
// const [lapNumber, setLapNumber] = useState(-1)
// const [lapData, setLapData] = useState([])
// const [fuelPerLap, setFuelPerLap] = useState('N/A')
// const [mpg, setMpg] = useState('0')
// const [previousCoords, setPreviousCoords] = useState([0, 0, 0])
// const [previousFuel, setPreviousFuel] = useState(1)
// const [fullscreenModal, setFullscreenModal] = useState(false)
// const [settingsModal, setSettingsModal] = useState(false)
// const toggleFullscreenModalShow = () => setFullscreenModal(!fullscreenModal)
// const toggleSettingsModalShow = () => setSettingsModal(!settingsModal)

// interface State {

// }
class Dashboard extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            connectionString: '',
            raceCode: '',
            data: '',
            recordingState: 'Record',
            lapCoords: [],
            prevLapCoords: [],
            lapNumber: -1,
            lapData: [],
            fuelPerLap: 'N/A',
            mpg: '0',
            previousCoords: [0, 0, 0],
            previousFuel: 1,
            fullscreenModal: false,
            settingsModal: false,
        }
    }

    handleInputChange = (inputName) => (value) => {
        const nextValue = value
        this.setState({
            [inputName]: nextValue,
        })
    }

    componentDidMount() {
        ipcRenderer.on('new-data-for-dashboard', (event: any, message: any) => {
            this.setState({ data: message })

            dataCount = dataCount + 1
            // update map
            // only update the map every 10 ticks to avoid running into performance issues
            if (dataCount % 10 == 0) {
                const c = this.state.lapCoords
                c.push([message.PositionX, -message.PositionZ])
                this.setState({ lapCoords: c })

                // If the map path is more than 6500 segments long, then start deleting the oldest segment every time you add a new segment.
                // This prevents the app from running into performance issues because of the map path becoming too long.
                // 6500 is a guesstimated value. It was chosen after testing the number of segments required for
                // one of FM7's slowest cars, the Toyota Arctic Truck, to draw a complete path around the Nurburgring Nordschleife + GP circuit.
                // The number required is roughly 6500 segments.
                if (c.length > 6500) {
                    c.shift()
                }
            }
            // update MPG
            if (dataCount % 50 == 0) {
                // distance travelled = starting coords
                const y1 = message.PositionY
                const x1 = message.PositionX
                const z1 = message.PositionZ
                const x2 = this.state.previousCoords[0]
                const y2 = this.state.previousCoords[1]
                const z2 = this.state.previousCoords[2]
                // do not use the game's calculation of distance travelled. if you do, the player
                // can simply go backwardss during a race and the games' distance travelled number will actually decrease
                // this would, of course, throw off the MPG calculation
                let distance = Math.sqrt(
                    Math.pow(x2 - x1, 2) +
                        Math.pow(y2 - y1, 2) +
                        Math.pow(z2 - z1, 2)
                )

                this.state.previousCoords[0] = message.PositionX
                this.state.previousCoords[1] = message.PositionY
                this.state.previousCoords[2] = message.PositionZ

                // convert to miles
                distance = distance * 0.00062137 * 1609.344

                // gallons consumed
                let fuelUsed = this.state.previousFuel - message.Fuel

                // convert to gallons
                fuelUsed = fuelUsed * 13 // 13 gallons is the typical sized fuel tank for a car. Forza doesn't tell you how many gallons their cars have.

                this.setState({ mpg: (distance / fuelUsed).toFixed(0) })
            }
        })

        if (this.state.data && this.state.data.Lap !== this.state.lapNumber) {
            this.setState({ lapNumber: this.state.data.Lap })

            // prevLapCoords need to be updated, new lap just started
            const c = this.state.lapCoords
            this.setState({ prevLapCoords: c })

            // delete current lapCoords
            this.state.lapCoords.length = 0

            // log previous lap data
            if (this.state.lapNumber != NaN && this.state.lapNumber != -1) {
                this.state.lapData.unshift([
                    this.state.lapNumber,
                    this.state.data.LastLapTime.toFixed(3),
                    (
                        this.state.data.LastLapTime -
                        this.state.data.BestLapTime
                    ).toFixed(3),
                ])
            }

            // update split times
            for (let i = 0; i < this.state.lapData.length; i++) {
                if (
                    Number(this.state.lapData[i][1]) ==
                    this.state.data.BestLapTime
                ) {
                    // this is the best time, so show no split time
                    this.state.lapData[i][2] = ''
                } else if (
                    Math.abs(
                        Number(this.state.lapData[i][1]) -
                            this.state.data.BestLapTime
                    ).toFixed(3) == '0.000'
                ) {
                    this.state.lapData[i][2] = ''
                } else {
                    this.state.lapData[i][2] = (
                        Number(this.state.lapData[i][1]) -
                        this.state.data.BestLapTime
                    ).toFixed(3)
                }
            }

            // update fuel numbers
            this.setState({
                fuelPerLap:
                    (
                        100 *
                        ((1 - this.state.data.Fuel) / this.state.lapNumber)
                    ).toFixed(2) + '%',
            })
        }

        if (this.state.data) {
            this.setState({ previousFuel: this.state.data.Fuel })
        }
    }

    componentDidUpdate() {
        ipcRenderer.on('new-data-for-dashboard', (event: any, message: any) => {
            this.setState({ data: message })

            dataCount = dataCount + 1
            // update map
            // only update the map every 10 ticks to avoid running into performance issues
            if (dataCount % 10 == 0) {
                const c = this.state.lapCoords
                c.push([message.PositionX, -message.PositionZ])
                this.setState({ lapCoords: c })

                // If the map path is more than 6500 segments long, then start deleting the oldest segment every time you add a new segment.
                // This prevents the app from running into performance issues because of the map path becoming too long.
                // 6500 is a guesstimated value. It was chosen after testing the number of segments required for
                // one of FM7's slowest cars, the Toyota Arctic Truck, to draw a complete path around the Nurburgring Nordschleife + GP circuit.
                // The number required is roughly 6500 segments.
                if (c.length > 6500) {
                    c.shift()
                }
            }
            // update MPG
            if (dataCount % 50 == 0) {
                // distance travelled = starting coords
                const y1 = message.PositionY
                const x1 = message.PositionX
                const z1 = message.PositionZ
                const x2 = this.state.previousCoords[0]
                const y2 = this.state.previousCoords[1]
                const z2 = this.state.previousCoords[2]
                // do not use the game's calculation of distance travelled. if you do, the player
                // can simply go backwardss during a race and the games' distance travelled number will actually decrease
                // this would, of course, throw off the MPG calculation
                let distance = Math.sqrt(
                    Math.pow(x2 - x1, 2) +
                        Math.pow(y2 - y1, 2) +
                        Math.pow(z2 - z1, 2)
                )

                this.state.previousCoords[0] = message.PositionX
                this.state.previousCoords[1] = message.PositionY
                this.state.previousCoords[2] = message.PositionZ

                // convert to miles
                distance = distance * 0.00062137 * 1609.344

                // gallons consumed
                let fuelUsed = this.state.previousFuel - message.Fuel

                // convert to gallons
                fuelUsed = fuelUsed * 13 // 13 gallons is the typical sized fuel tank for a car. Forza doesn't tell you how many gallons their cars have.

                this.setState({ mpg: (distance / fuelUsed).toFixed(0) })
            }
        })

        if (this.state.data && this.state.data.Lap !== this.state.lapNumber) {
            this.setState({ lapNumber: this.state.data.Lap })

            // prevLapCoords need to be updated, new lap just started
            const c = this.state.lapCoords
            this.setState({ prevLapCoords: c })

            // delete current lapCoords
            this.state.lapCoords.length = 0

            // log previous lap data
            if (this.state.lapNumber != NaN && this.state.lapNumber != -1) {
                this.state.lapData.unshift([
                    this.state.lapNumber,
                    this.state.data.LastLapTime.toFixed(3),
                    (
                        this.state.data.LastLapTime -
                        this.state.data.BestLapTime
                    ).toFixed(3),
                ])
            }

            // update split times
            for (let i = 0; i < this.state.lapData.length; i++) {
                if (
                    Number(this.state.lapData[i][1]) ==
                    this.state.data.BestLapTime
                ) {
                    // this is the best time, so show no split time
                    this.state.lapData[i][2] = ''
                } else if (
                    Math.abs(
                        Number(this.state.lapData[i][1]) -
                            this.state.data.BestLapTime
                    ).toFixed(3) == '0.000'
                ) {
                    this.state.lapData[i][2] = ''
                } else {
                    this.state.lapData[i][2] = (
                        Number(this.state.lapData[i][1]) -
                        this.state.data.BestLapTime
                    ).toFixed(3)
                }
            }

            // update fuel numbers
            this.setState({
                fuelPerLap:
                    (
                        100 *
                        ((1 - this.state.data.Fuel) / this.state.lapNumber)
                    ).toFixed(2) + '%',
            })
        }

        if (this.state.data) {
            this.setState({ previousFuel: this.state.data.Fuel })
        }
    }

    render() {
        return (
            <React.Fragment>
                <ThemeProvider theme={darkTheme}>
                    {/* left column */}
                    <div style={sideColumnStyle}>
                        <div style={accelerometerContainerStyle}>
                            <Accelerometer
                                X={
                                    this.state.data
                                        ? this.state.data.AccelerationX
                                        : 0
                                }
                                Y={
                                    this.state.data
                                        ? this.state.data.AccelerationY
                                        : 0
                                }
                                Z={
                                    this.state.data
                                        ? this.state.data.AccelerationZ
                                        : 0
                                }
                            />
                        </div>
                        <div style={lapContainerStyle}>
                            <Laps
                                LapNumber={this.state.lapNumber + 1}
                                LapTime={
                                    this.state.data
                                        ? this.state.data.CurrentLapTime.toFixed(
                                              3
                                          )
                                        : '0.00'
                                }
                                PreviousLaps={this.state.lapData}
                            />
                        </div>
                    </div>

                    {/* center column */}
                    <div style={centerColumnStyle}>
                        <div style={mainHudContainerStyle}>
                            <div style={mainHudTopStyle}>
                                <table
                                    style={{
                                        width: '100%',
                                        textAlign: 'center',
                                        fontWeight: 'normal',
                                    }}
                                >
                                    <tr>
                                        <td style={{}}>
                                            <div style={dataValueStyle}>
                                                <Button
                                                    variant="outline-danger"
                                                    onClick={() => {
                                                        ipcRenderer.send(
                                                            'switch-recording-mode',
                                                            ''
                                                        )
                                                        this.state
                                                            .recordingState ===
                                                        'Record'
                                                            ? this.setState({
                                                                  recordingState:
                                                                      'Stop Recording',
                                                              })
                                                            : this.setState({
                                                                  recordingState:
                                                                      'Record',
                                                              })
                                                    }}
                                                >
                                                    {this.state.recordingState}
                                                </Button>
                                            </div>
                                        </td>
                                        <td style={{}}>
                                            <div style={dataValueStyle}>
                                                <Button
                                                    variant="outline-danger"
                                                    onClick={() => {
                                                        this.setState({
                                                            lapCoords: [],
                                                            prevLapCoords: [],
                                                            lapNumber: -1,
                                                            lapData: [],
                                                            fuelPerLap: 'N/A',
                                                            mpg: '0',
                                                            previousCoords: [
                                                                0, 0, 0,
                                                            ],
                                                            previousFuel: 1,
                                                        })
                                                    }}
                                                >
                                                    Reset
                                                </Button>
                                            </div>
                                        </td>
                                        <td style={{}}>
                                            {/* <div style={dataValueStyle}>
                                            <Button
                                                variant="outline-danger"
                                                onClick={toggleFullscreenModalShow}
                                            >
                                                Fullscreen
                                            </Button>
                                            <MDBModal
                                                show={this.state.fullscreenModal}
                                                getOpenState={(e: any) =>
                                                    setFullscreenModal(e)
                                                }
                                                tabIndex="-1"
                                            >
                                                <MDBModalDialog>
                                                    <MDBModalContent>
                                                        <MDBModalBody>
                                                            I'm too lazy to write
                                                            the code for this. Just
                                                            press F11 and that'll do
                                                            the trick.
                                                        </MDBModalBody>
    
                                                        <MDBModalFooter>
                                                            <Button
                                                                variant="danger"
                                                                onClick={
                                                                    toggleFullscreenModalShow
                                                                }
                                                            >
                                                                Close
                                                            </Button>
                                                        </MDBModalFooter>
                                                    </MDBModalContent>
                                                </MDBModalDialog>
                                            </MDBModal>
                                        </div> */}
                                        </td>
                                        <td style={{}}>
                                            <div style={dataValueStyle}>
                                                <Button
                                                    variant="outline-danger"
                                                    onClick={() =>
                                                        this.setState({
                                                            settingsModal:
                                                                !this.state
                                                                    .settingsModal,
                                                        })
                                                    }
                                                >
                                                    Settings
                                                </Button>
                                                <MDBModal
                                                    show={
                                                        this.state.settingsModal
                                                    }
                                                    tabIndex="-1"
                                                >
                                                    <MDBModalDialog>
                                                        <MDBModalContent>
                                                            <MDBModalBody>
                                                                <form>
                                                                    <MDBInput
                                                                        name="connectionString"
                                                                        label="Connection String"
                                                                        type="text"
                                                                        getValue={this.handleInputChange(
                                                                            'connectionString'
                                                                        )}
                                                                    />
                                                                    <MDBInput
                                                                        name="raceCode"
                                                                        label="Race Code"
                                                                        type="text"
                                                                        getValue={this.handleInputChange(
                                                                            'raceCode'
                                                                        )}
                                                                    />
                                                                </form>
                                                            </MDBModalBody>

                                                            <MDBModalFooter>
                                                                <Button
                                                                    variant="danger"
                                                                    onClick={() =>
                                                                        this.setState(
                                                                            {
                                                                                settingsModal:
                                                                                    !this
                                                                                        .state
                                                                                        .settingsModal,
                                                                            }
                                                                        )
                                                                    }
                                                                >
                                                                    Close
                                                                </Button>
                                                            </MDBModalFooter>
                                                        </MDBModalContent>
                                                    </MDBModalDialog>
                                                </MDBModal>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <div style={{ height: '80%' }}>
                                <Tach
                                    outerRadius={90}
                                    innerRadius={90}
                                    startAngle={0}
                                    endAngle={
                                        this.state.data
                                            ? (this.state.data
                                                  .CurrentEngineRpm /
                                                  this.state.data
                                                      .EngineMaxRpm) *
                                              2 *
                                              Math.PI *
                                              (340 / 360)
                                            : 2 * Math.PI * (320 / 360)
                                    }
                                    rpm={
                                        this.state.data
                                            ? Math.round(
                                                  this.state.data
                                                      .CurrentEngineRpm
                                              )
                                                  .toString()
                                                  .replace(
                                                      /\B(?=(\d{3})+(?!\d))/g,
                                                      ','
                                                  )
                                            : 0
                                    }
                                    gear={
                                        this.state.data
                                            ? this.state.data.Gear == 0
                                                ? 'R'
                                                : this.state.data.Gear
                                            : 'N'
                                    }
                                    speed={
                                        this.state.data
                                            ? Math.abs(
                                                  Math.round(
                                                      this.state.data.Speed *
                                                          2.237
                                                  )
                                              )
                                                  .toString()
                                                  .replace(
                                                      /\B(?=(\d{3})+(?!\d))/g,
                                                      ','
                                                  )
                                            : 0
                                    }
                                />
                            </div>

                            <div style={mainHudBottomStyle}>
                                <table
                                    style={{
                                        width: '100%',
                                        textAlign: 'center',
                                        fontWeight: 'normal',
                                    }}
                                >
                                    <tr>
                                        <td style={{ width: '20%' }}>
                                            <div style={dataValueStyle}>
                                                {this.state.data
                                                    ? this.state.fuelPerLap
                                                    : 'N/A'}
                                            </div>
                                        </td>
                                        <td style={{ width: '20%' }}>
                                            <div style={dataValueStyle}>
                                                {this.state.data
                                                    ? (
                                                          this.state.data.Fuel *
                                                          100
                                                      ).toFixed(3)
                                                    : 100.0}
                                                %
                                            </div>
                                        </td>
                                        <td style={{ width: '20%' }}>
                                            <div style={dataValueStyle}>
                                                {this.state.data
                                                    ? secondsToTimeString(
                                                          this.state.data
                                                              .CurrentLapTime
                                                      )
                                                    : '0:00'}
                                            </div>
                                        </td>
                                        <td style={{ width: '20%' }}>
                                            <div style={dataValueStyle}>
                                                N/A
                                            </div>
                                        </td>
                                        <td style={{ width: '20%' }}>
                                            <div style={dataValueStyle}>
                                                {this.state.data
                                                    ? this.state.mpg
                                                    : 1}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div style={dataKeyStyle}>
                                                FUEL/LAP
                                            </div>
                                        </td>
                                        <td>
                                            <div style={dataKeyStyle}>FUEL</div>
                                        </td>
                                        <td>
                                            <div style={dataKeyStyle}>
                                                CURRENT LAP
                                            </div>
                                        </td>
                                        <td>
                                            <div style={dataKeyStyle}>
                                                PIT IN
                                            </div>
                                        </td>
                                        <td>
                                            <div style={dataKeyStyle}>MPG</div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* right column */}
                    <div style={sideColumnStyle}>
                        <div style={basicTelemetryContainerStyle}>
                            <Tires
                                Pitch={
                                    this.state.data ? this.state.data.Pitch : 0
                                }
                                Yaw={this.state.data ? this.state.data.Yaw : 0}
                                Roll={
                                    this.state.data ? this.state.data.Roll : 0
                                }
                                Brake={
                                    this.state.data ? this.state.data.Brake : 0
                                }
                                FlTemp={
                                    this.state.data
                                        ? this.state.data.TireTempFl
                                        : 0
                                }
                                FrTemp={
                                    this.state.data
                                        ? this.state.data.TireTempFr
                                        : 0
                                }
                                RlTemp={
                                    this.state.data
                                        ? this.state.data.TireTempRl
                                        : 0
                                }
                                RrTemp={
                                    this.state.data
                                        ? this.state.data.TireTempRr
                                        : 0
                                }
                                FlSlip={
                                    this.state.data
                                        ? this.state.data
                                              .TireCombinedSlipFrontLeft
                                        : 0
                                }
                                FrSlip={
                                    this.state.data
                                        ? this.state.data
                                              .TireCombinedSlipFrontRight
                                        : 0
                                }
                                RlSlip={
                                    this.state.data
                                        ? this.state.data
                                              .TireCombinedSlipRearLeft
                                        : 0
                                }
                                RrSlip={
                                    this.state.data
                                        ? this.state.data
                                              .TireCombinedSlipRearRight
                                        : 0
                                }
                                FlSlipRatio={
                                    this.state.data
                                        ? this.state.data.TireSlipRatioFrontLeft
                                        : 0
                                }
                                FrSlipRatio={
                                    this.state.data
                                        ? this.state.data
                                              .TireSlipRatioFrontRight
                                        : 0
                                }
                                RlSlipRatio={
                                    this.state.data
                                        ? this.state.data.TireSlipRatioRearLeft
                                        : 0
                                }
                                RrSlipRatio={
                                    this.state.data
                                        ? this.state.data.TireSlipRatioRearRight
                                        : 0
                                }
                                FlSlipAngle={
                                    this.state.data
                                        ? this.state.data.TireSlipAngleFrontLeft
                                        : 0
                                }
                                FrSlipAngle={
                                    this.state.data
                                        ? this.state.data
                                              .TireSlipAngleFrontRight
                                        : 0
                                }
                                RlSlipAngle={
                                    this.state.data
                                        ? this.state.data.TireSlipAngleRearLeft
                                        : 0
                                }
                                RrSlipAngle={
                                    this.state.data
                                        ? this.state.data.TireSlipAngleRearRight
                                        : 0
                                }
                            />
                        </div>
                        <div style={basicTelemetryContainerStyle}>
                            <Steering
                                power={
                                    this.state.data ? this.state.data.Power : 0
                                }
                                torque={
                                    this.state.data ? this.state.data.Torque : 0
                                }
                                throttle={
                                    this.state.data
                                        ? this.state.data.Accelerator
                                        : 0
                                }
                                steering={
                                    this.state.data ? this.state.data.Steer : 0
                                }
                                boost={
                                    this.state.data ? this.state.data.Boost : 0
                                }
                                outerRadius={90}
                                innerRadius={90}
                                startAngle={0}
                                endAngle={
                                    this.state.data
                                        ? (this.state.data.CurrentEngineRpm /
                                              this.state.data.EngineMaxRpm) *
                                          2 *
                                          Math.PI *
                                          (340 / 360)
                                        : 2 * Math.PI * (320 / 360)
                                }
                            />
                        </div>
                        <div style={basicTelemetryContainerStyle}>
                            <Map
                                Coords={this.state.lapCoords}
                                PrevLapCoords={this.state.prevLapCoords}
                                LapNumber={this.state.lapNumber}
                                Position={
                                    this.state.data
                                        ? this.state.data.RacePosition
                                        : 0
                                }
                                Distance={
                                    this.state.data
                                        ? this.state.data.Distance.toFixed(0)
                                        : 0
                                }
                                Remaining={
                                    this.state.data
                                        ? this.state.data.NormalDrivingLine
                                        : 0
                                }
                                X={
                                    this.state.data
                                        ? this.state.data.PositionX.toFixed(0)
                                        : 0
                                }
                                Y={
                                    this.state.data
                                        ? this.state.data.PositionY.toFixed(0)
                                        : 0
                                }
                                Z={
                                    this.state.data
                                        ? this.state.data.PositionZ.toFixed(0)
                                        : 0
                                }
                                RaceTime={
                                    this.state.data
                                        ? this.state.data.CurrentRaceTime
                                        : 0
                                }
                            />
                        </div>
                    </div>
                </ThemeProvider>
            </React.Fragment>
        )
    }
}

export default Dashboard

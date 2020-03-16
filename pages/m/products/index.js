import axios from 'axios'
import {useState} from 'react'
import {useRouter} from 'next/router'
import { Button } from 'antd-mobile'
import style from './style.less'

function Tips() {
  return (
    <div className={'tips'}>
      <h1>Recommended for you</h1>
      <p>Apply  for 4 loans, can increase the success rate up to <i>95%</i></p>
    </div>
  )
}

function Cell(props) {
  const router = useRouter()
  const [isApply, setApply] = useState(false);

  const onApply = async () => {
    if (isApply) return
    setApply(true)
    const {data: {code, data, msg}} = await axios.post(
      '/api/product/m/apply.do',
      {
        productId: props.productId,
        ...router.query
      }
    )
    setApply(false)
    if (code === 0) {
      if (data.type === 'url') {
        location.href = data.url
      }
    }
   // console.log(data)
  }

  return (
    <div className="cell">
      <div className="head">
        <img src={props.logo}/>
        <h2>{props.productName}</h2>
      </div>
      <div className="content">
        <div className="mount">
          <h1>₹{props.maxAmount}</h1>
          <span>Max Mount</span>
        </div>
        <div>
          <div>
            <span>Interest: </span>
            <span>{props.monthInterest}%/Day</span>
          </div>
          <div>
            <span>Tenure: </span>
            <span>{props.minMonthTerms}-{props.maxMonthTerms}Day</span>
          </div>
        </div>
        <Button loading={isApply} type="primary" onClick={onApply}>To Apply</Button>
      </div>
      <p>{props.description}</p>
    </div>
  )
}

function Products({products}) {
  return products.map((product, i) => <Cell key={i} {...product}/>)
}

function body(props) {
  return (
    <div>
      <Tips/>
      <Products {...props}/>
      <footer>High Loan Amount:Online applications,up to ₹500000 Low Interest Rate:Annualized retes,up to 36% and as low as 9% Loan Term:1month(shortest, including renewal period) - 36 months (Longest, includingrenewal period) Age requirement must be 18 or above All rights reserved. @2020 LendingDirector Address: 238, Udyog Vihar Phase 4 Rd, Phase II, Udyog Vihar, Sector 18, Gurugram, Haryana 122016, India</footer>
    </div>
  )
}

body.getInitialProps = async ctx => {
  const {data: {code, data, msg}} = await axios.get('https://api.lendingdirector.com/product/m/getList.do')
  const products = code === 0 ? data : []
  return {products}
}

export default body

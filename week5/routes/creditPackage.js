const express = require('express')

const router = express.Router()
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('CreditPackage')
const { isUndefined, isNotValidSting, isNotValidInteger } = require('../utils/validUtils')

router.get('/', async (req, res, next) => {
  try {
    const packages = await dataSource.getRepository("CreditPackage").find({
      select: ["id", "name", "credit_amount", "price"]
    })
    res.status(200).json(
      {
        status: "success",
        data: packages
      }
    )
  } catch (error) {
    next(error)
  }

})

router.post('/', async (req, res, next) => {
  try {
    const { name, credit_amount, price } = req.body
    console.log(req.body)
    if (isUndefined(name) || isNotValidSting(name) ||
      isUndefined(credit_amount) || isNotValidInteger(credit_amount) ||
      isUndefined(price) || isNotValidInteger(price)) {
      res.status(400).json({
        status: "failed",
        message: "欄位未填寫正確"
      })
      return
    }

    const creditPackageRepo = await dataSource.getRepository("CreditPackage")
    const existPackage = await creditPackageRepo.find({
      where: {
        // 考慮輸入有空白鍵的情形
        // 正則表達式 /\s/g 會匹配字串中所有的空白字符
        name: name.replace(/\s/g, "")
      }
    })
    console.log(existPackage)
    if (existPackage.length > 0) {
      res.status(409).json(
        {
          status: "failed",
          message: "資料重複"
        }
      )
      return
    }
    const newPackage = await creditPackageRepo.create({
      name: name,
      credit_amount: credit_amount,
      price: price
    })
    const result = await creditPackageRepo.save(newPackage)
    res.status(200).json(
      {
        status: "success",
        data: result
      }
    )
  } catch (error) {
    next(error)
  }
})

router.delete('/:creditPackageId', async (req, res, next) => {
  try {
    const { creditPackageId } = req.params
    console.log(creditPackageId)

    if (isUndefined(creditPackageId) || isNotValidSting(creditPackageId)) {
      res.status(400).json(
        {
          status: "failed1",
          message: "ID錯誤"
        }
      )
      return
    }
    const result = await dataSource.getRepository("CreditPackage").delete(creditPackageId)
    // console.log(result)
    if (result.affected === 0) {
      res.status(400).json(
        {
          status: "failed2",
          message: "ID錯誤"
        }
      )
      return
    }
    res.status(200).json(
      {
        status: "success"
      }
    )
  } catch (error) {
    next(error)
  }
})

module.exports = router
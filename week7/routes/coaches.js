const express = require('express')
const router = express.Router()
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('Coach')

const { isNotValidSting, isNotValidInteger } = require('../utils/validUtils')

// 取得教練列表
router.get('/', async (req, res, next) => {
  const { per, page } = req.query

  const limit = parseInt(per, 10) || 10;  // 預設每頁 10 筆
  const currentPage = parseInt(page, 10) || 1;
  const offset = (currentPage - 1) * limit;

  try {
    if (isNotValidSting(per) || isNotValidSting(page)) {
      res.status(400).json({
        status: 'failed',
        message: '欄位未填寫正確'
      })
      return
    }

    // per & page 轉成數字

    // 取得教練列表
    const coaches = await dataSource.getRepository('Coach').find(
      {
        select: ['id', 'user_id'],
        relations: ['User'],
        take: limit,
        skip: offset
      }
    )
    res.status(200).json(
      {
        status: "sucess",
        data: coaches
      }
    )
  } catch (error) {
    logger.error(error)
    next(error)
  }
})

// 取得教練詳細資訊
router.get('/:coachId', async (req, res, next) => {
  const { coachId } = req.params

  try {
    // 輸入是否正確
    // console.log(isNotValidSting(coachId))
    if (isNotValidSting(coachId)) {
      res.status(400).json({
        status: 'failed',
        message: '欄位未填寫正確'
      })
      return
    }

    const coachRepo = dataSource.getRepository('Coach')
    const CoachData = await coachRepo.findOne({
      where: { id: coachId }
    })
    console.log('HERE1:')
    console.log(CoachData)
    if (!CoachData) {
      res.status(400).json({
        status: 'failed',
        message: '找不到該教練'
      })
      return
    }

    const userRepo = dataSource.getRepository('User')
    const UserData = await userRepo.find({
      select: ['name', 'role'],
      where: { id: CoachData.user_id }
    })
    console.log('HERE2:')
    console.log(userRepo)

    res.status(200).json({
      status: 'success',
      data: {
        user: UserData,
        coach: CoachData
      }
    })

  } catch (error) {
    logger.error(error)
    next(error)
  }

})


module.exports = router
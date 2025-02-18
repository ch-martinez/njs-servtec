import * as controller from '../controllers/pdf.controller.mjs'
import express from 'express'

const router = express.Router({ mergeParams: true })

router.get('/', controller.detailToPdf)

export default router
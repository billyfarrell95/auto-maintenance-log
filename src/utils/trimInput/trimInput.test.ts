import { expect, it, describe } from 'vitest'
import { trimInput } from './trimInput'
import { testItem } from './testItem'

describe('trimInput', () => {
    it('should trim all string fields and set shop to "none" if empty', () => {
        const inputItem = testItem;

        const expectedOutput = {
            ...testItem,
            cost: '100',
            description: 'Description here',
            shop: 'none', 
            mileage: '1200',
            memo: 'Note here'
        }

        const result = trimInput(inputItem)

        expect(result).toEqual(expectedOutput)
    })

    it('should not change other fields if they are already trimmed', () => {
        const inputItem = {
            ...testItem,
            cost: '100',
            description: 'Description here',
            shop: 'Shop A',
            mileage: '1200',
            memo: 'Note here'
        }

        const expectedOutput = { ...inputItem } 

        const result = trimInput(inputItem)

        expect(result).toEqual(expectedOutput)
    })
})
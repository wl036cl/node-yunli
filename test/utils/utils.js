/**
 * Author:ll36
 * Create Time:2018/03/18 20:40
 * Descripttion:
 */
import { extend,getRandStringEx} from '../../utils/utils'

describe('utils.js: ', function() {
  it('extend() should work fine.',()=> {
    let data={name:'sss',age:22,subject:['chinese','math','English']};

    expect(extend({},data)).toEqual(data);
    expect(extend(data,{})).toEqual(data);
    expect(extend(data,data)).toEqual(data);

    expect(extend(true,{},data)).toEqual(data);
    expect(extend(true,data,{})).toEqual(data);
    expect(extend(true,data,data)).toEqual(data);
  })

  it('getRandStringEx() should work fine.', ()=> {
    let length;
    let result=getRandStringEx(length);

    expect(result.length).toEqual(0);

    length=10;
    result=getRandStringEx(length);
    expect(result.length).toEqual(length);

    length=100;
    result=getRandStringEx(length);
    expect(result.length).toEqual(64);
  })

});
describe('utils.js: ', function() {

});
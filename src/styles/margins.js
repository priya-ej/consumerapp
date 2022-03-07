import {SCREEN_WIDTH, SCREEN_HEIGHT} from './scale';

const REFRENCED_WIDTH = 320;
const REFRENCED_HEIGHT = 560;

const calculateHeight = height => (height / REFRENCED_HEIGHT) * SCREEN_HEIGHT;
const calculateWidth = width => (width / REFRENCED_WIDTH) * SCREEN_WIDTH;

const h60 = calculateHeight(60); // height 60 pt
const h298 = calculateHeight(298);
const h40 = calculateHeight(40);
const h24 = calculateHeight(24);
const h15 = calculateHeight(15);
const h12 = calculateHeight(12);
const h4 = calculateHeight(4);
const h8 = calculateHeight(8);
const h54 = calculateHeight(54);
const h50 = calculateHeight(50);
const h32 = calculateHeight(32);
const h71 = calculateHeight(71);
const h186 = calculateHeight(186);
const h20 = calculateHeight(20);
const h16 = calculateHeight(16);
const h22 = calculateHeight(22);
const h44 = calculateHeight(44);
const h10 = calculateHeight(10);
const h5 = calculateHeight(5);
const h1 = calculateHeight(1);
const h2 = calculateHeight(2);
const h152 = calculateHeight(152);
const h70 = calculateHeight(70);
const h35 = calculateHeight(35);
const h134 = calculateHeight(134);
const h26 = calculateHeight(26);
const h59 = calculateHeight(59);
const h64 = calculateHeight(64);
const h36 = calculateHeight(36);
const h48 = calculateHeight(48);
const h146 = calculateHeight(146);
const h225 = calculateHeight(225);
const h9 = calculateHeight(9);
const h115 = calculateHeight(115);
const h6 = calculateHeight(7);
const h27 = calculateHeight(27);
const h75 = calculateHeight(75);
const h250 = calculateHeight(250);
const h300 = calculateHeight(300);
const h350 = calculateHeight(350);
const h400 = calculateHeight(400);
const h200 = calculateHeight(200);

const w20 = calculateWidth(20);
const w12 = calculateWidth(12);
const w15 = calculateWidth(15);
const w280 = calculateWidth(280);
const w9 = calculateWidth(9);
const w103 = calculateWidth(103);
const w288 = calculateWidth(288);
const w124 = calculateWidth(124);
const w34 = calculateWidth(34);
const w9_6 = calculateWidth(9.6);
const w11 = calculateWidth(11);
const w13 = calculateWidth(13);
const w5 = calculateWidth(5);
const w4 = calculateWidth(4);
const w17 = calculateHeight(17);
const w56 = calculateWidth(56);
const w260 = calculateWidth(260);
const w16 = calculateWidth(16);
const w69 = calculateWidth(69);
const w127 = calculateWidth(127);
const w44 = calculateWidth(44);
const w205 = calculateWidth(205);
const w82 = calculateWidth(82);
const w99 = calculateWidth(99);
const w121 = calculateWidth(121);
const w29 = calculateWidth(29);
const w24 = calculateWidth(24);
const w27 = calculateWidth(27);
const w266 = calculateWidth(266);
const w30 = calculateWidth(30);
const w50 = calculateWidth(50);
const w145 = calculateWidth(145);
const w18 = calculateWidth(18);
const w16h = calculateWidth(16.5);

export default {
  h60,
  h298,
  h40,
  h24,
  h15,
  h12,
  h4,
  h8,
  h54,
  h50,
  h32,
  h71,
  h186,
  h20,
  h16,
  h22,
  h44,
  h10,
  h5,
  h6,
  h1,
  h2,
  h152,
  h70,
  h35,
  h134,
  h26,
  h27,
  h59,
  h64,
  h36,
  h48,
  h146,
  h225,
  h9,
  h115,
  h75,
  h300,
  h250,
  h350,
  h400,
  h200,

  w20,
  w12,
  w15,
  w280,
  w9,
  w103,
  w288,
  w124,
  w34,
  w9_6,
  w11,
  w13,
  w5,
  w4,
  w17,
  w56,
  w260,
  w16,
  w16h,
  w69,
  w127,
  w44,
  w205,
  w82,
  w99,
  w121,
  w29,
  w24,
  w27,
  w266,
  w30,
  w50,
  w145,
  w18,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
};

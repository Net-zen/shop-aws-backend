create extension if not exists "uuid-ossp";

create table  products (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text,
    price integer,
    image_url text
);

create table stocks (
    id uuid primary key default uuid_generate_v4(),
    product_id uuid,
    count integer,
    foreign key ("product_id") references "products" ("id")
);

WITH product as (
    insert into products (title, description, price, image_url) values
        ('Atlanta Hawks',
        'Atlanta Hawks Nike Association Swingman Jersey - Trae Young - Mens',
        107,
        'http://prankster.omsk.ru/img/atlanta.webp'),
        ('Boston Celtics',
        'Boston Celtics Nike Icon Swingman Jersey - Jayson Tatum - Mens',
        107,
        'http://prankster.omsk.ru/img/boston.webp'),
        ('Brooklyn Nets',
        'Brooklyn Nets Jordan Statement Swingman Jersey - Kevin Durant - Mens',
        107,
        'http://prankster.omsk.ru/img/brooklyn.jpg'),
        ('Charlotte Hornets',
        'Charlotte Hornets Jordan Icon Swingman Jersey - Miles Bridges - Mens',
        104,
        'http://prankster.omsk.ru/img/charlotte.jpg'),
        ('Chicago Bulls',
        'Chicago Bulls Michael Jordan 1984 Road Authentic Jersey By Mitchell & Ness - Mens',
        377,
        'http://prankster.omsk.ru/img/chicago.jpg'),
        ('Cleveland Cavaliers',
        'Cleveland Cavaliers LeBron James Hardwood Classics Road Swingman Jersey by Mitchell & Ness - Youth',
        85,
        'http://prankster.omsk.ru/img/cleveland.webp'),
        ('Detroit Pistons',
        'Detroit Pistons Nike Swingman Jersey - Blue - Cade Cunningham - Mens - Icon Edition',
        128,
        'http://prankster.omsk.ru/img/detroit.jpg'),
        ('Indiana Pacers',
        'Indiana Pacers Nike Earned Edition Swingman Jersey - Domantas Sabonis - Mens',
        118,
        'http://prankster.omsk.ru/img/indiana.jpg'),
        ('Miami Heat',
        'Miami Heat Jordan Statement Swingman Jersey - Jimmy Butler - Mens',
        107,
        'http://prankster.omsk.ru/img/miami.jpg'),
        ('Milwaukee Bucks',
        'Milwaukee Bucks Nike Icon Swingman Jersey - Giannis Antetokounmpo - Mens',
        101,
        'http://prankster.omsk.ru/img/milwaukee.jpg'),
        ('New York Knicks',
        'New York Knicks Nike Icon Swingman Jersey - RJ Barrett - Mens',
        15,
        'http://prankster.omsk.ru/img/new-york.jpg'),
        ('Orlando Magic',
        'Orlando Magic Nike Icon Swingman Jersey - Cole Anthony - Youth',
        104,
        'http://prankster.omsk.ru/img/orlando.jpg'),
        ('Philadelphia 76ers',
        'Philadelphia 76ers Nike Earned Edition Swingman Jersey - Matisse Thybulle - Youth',
        104,
        'http://prankster.omsk.ru/img/philadelphia.webp'),
        ('Toronto Raptors',
        'Toronto Raptors Vince Carter Hardwood Classics Home Swingman Jersey By Mitchell & Ness - Mens\nSelected slide 1 of 4Display slide 2 of 4Display slide 3 of 4Display slide 4 of 4\nToronto Raptors Vince Carter Hardwood Classics Home Swingman Jersey By Mitchell & Ness - Mens',
        114,
        'http://prankster.omsk.ru/img/toronto.jpg'),
        ('Washington Wizards',
        'Washington Wizards Nike Association Swingman Jersey - Russell Westbrook - Youth',
        83,
        'http://prankster.omsk.ru/img/washington.webp'),
        ('Dallas Mavericks',
        'Dallas Mavericks Nike Association Swingman Jersey - Luka Doncic - Mens',
        104,
        'http://prankster.omsk.ru/img/dallas.webp'),
        ('Denver Nuggets',
        'Denver Nuggets Jordan Statement Swingman Jersey - Nikola Jokic - Mens',
        118,
        'http://prankster.omsk.ru/img/denver.jpg'),
        ('Golden State Warriors',
        'Golden State Warriors Nike Association Swingman Jersey - Stephen Curry - Mens',
        107,
        'http://prankster.omsk.ru/img/golden.webp'),
        ('Houston Rockets',
        'Houston Rockets Nike Swingman Jersey - Red - Jalen Green - Mens - Icon Edition',
        128,
        'http://prankster.omsk.ru/img/houston.jpg'),
        ('LA Clippers',
        'LA Clippers Nike Association Swingman Jersey - Kawhi Leonard - Mens',
        107,
        'http://prankster.omsk.ru/img/la-clippers.webp'),
        ('Los Angeles Lakers',
        'Los Angeles Lakers Jordan Statement Swingman Jersey - Lebron James - Mens',
        107,
        'http://prankster.omsk.ru/img/los-angeles-lakers.webp'),
        ('Memphis Grizzlies',
        'Memphis Grizzlies Nike Association Swingman Jersey - Ja Morant - Mens',
        107,
        'http://prankster.omsk.ru/img/memphis-grizzlies.webp'),
        ('Minnesota Timberwolves',
        'Minnesota Timberwolves Nike Icon Swingman Jersey - Karl-Anthony Towns - Mens',
        107,
        'http://prankster.omsk.ru/img/minnesota.jpg'),
        ('New Orleans Pelicans',
        'New Orleans Pelicans Nike Association Swingman Jersey - Zion Williamson - Mens',
        107,
        'http://prankster.omsk.ru/img/new-orleans.jpg'),
        ('Oklahoma City Thunder',
        'Oklahoma City Thunder Nike Swingman Jersey - Blue - Josh Giddey - Mens - Icon Edition',
        128,
        'http://prankster.omsk.ru/img/oklahoma.jpg'),
        ('Phoenix Suns',
        'Phoenix Suns Nike Icon Swingman Jersey - Devin Booker - Mens',
        107,
        'http://prankster.omsk.ru/img/phoenix.webp'),
        ('Portland Trail Blazers',
        'Portland Trail Blazers Nike Icon Swingman Jersey - Damian Lillard - Youth',
        83,
        'http://prankster.omsk.ru/img/portland.webp'),
        ('Sacramento Kings',
        'Sacramento Kings Nike Icon Swingman Jersey - DeAaron Fox - Mens',
        107,
        'http://prankster.omsk.ru/img/sacramento.webp'),
        ('San Antonio Spurs',
        'San Antonio Spurs Nike Icon Swingman Jersey - DeMar DeRozan - Mens',
        104,
        'http://prankster.omsk.ru/img/san-antonio.jpg'),
        ('Utah Jazz',
        'Utah Jazz Nike Association Swingman Jersey - Donovan Mitchell - Mens',
        107,
        'http://prankster.omsk.ru/img/utah.jpg')
        returning id, title
)
insert into stocks (product_id, count) values
    ((select id from product where title = 'Atlanta Hawks'), 1),
    ((select id from product where title = 'Boston Celtics'), 2),
    ((select id from product where title = 'Brooklyn Nets'), 7),
    ((select id from product where title = 'Charlotte Hornets'), 12),
    ((select id from product where title = 'Chicago Bulls'), 7),
    ((select id from product where title = 'Cleveland Cavaliers'), 8),
    ((select id from product where title = 'Detroit Pistons'), 2),
    ((select id from product where title = 'Indiana Pacers'), 4),
    ((select id from product where title = 'Miami Heat'), 9),
    ((select id from product where title = 'Milwaukee Bucks'), 7),
    ((select id from product where title = 'New York Knicks'), 5),
    ((select id from product where title = 'Orlando Magic'), 2),
    ((select id from product where title = 'Philadelphia 76ers'), 6),
    ((select id from product where title = 'Toronto Raptors'), 8),
    ((select id from product where title = 'Washington Wizards'), 3),
    ((select id from product where title = 'Dallas Mavericks'), 8),
    ((select id from product where title = 'Denver Nuggets'), 2),
    ((select id from product where title = 'Golden State Warriors'), 1),
    ((select id from product where title = 'Houston Rockets'), 7),
    ((select id from product where title = 'LA Clippers'), 4),
    ((select id from product where title = 'Los Angeles Lakers'), 3),
    ((select id from product where title = 'Memphis Grizzlies'), 1),
    ((select id from product where title = 'Minnesota Timberwolves'), 9),
    ((select id from product where title = 'New Orleans Pelicans'), 6),
    ((select id from product where title = 'Oklahoma City Thunder'), 5),
    ((select id from product where title = 'Phoenix Suns'), 2),
    ((select id from product where title = 'Portland Trail Blazers'), 8),
    ((select id from product where title = 'Sacramento Kings'), 7),
    ((select id from product where title = 'San Antonio Spurs'), 4),
    ((select id from product where title = 'Utah Jazz'), 3)